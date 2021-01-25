function inserirSessao(idExplicador, id_disciplina) {
	let auxDiaSelecionado = new Date(sessionStorage.getItem("dataSelecionada"));
	let diaSelecionado = auxDiaSelecionado.getUTCFullYear() + "-" + ("00" + (auxDiaSelecionado.getUTCMonth() + 1)).slice(-2) + "-" + ("00" + auxDiaSelecionado.getUTCDate()).slice(-2);
	query =
		"INSERT INTO marcacao (explicando_user_id, explicador_user_id, data, tempoInicio, tempoFinal, disciplina_id) VALUES (" +
		sessionStorage.getItem("idUser") +
		", " +
		idExplicador +
		", '" +
		diaSelecionado +
		"', '" +
		sessionStorage.getItem("tempoInicial") +
		"', '" +
		sessionStorage.getItem("tempoFinal") +
		"', " +
		id_disciplina +
		")";
	console.log(query);
	connection.query(query, function (err) {
		if (err) {
			console.log(err);
		}
	});
	document.getElementById("listaExplicadores").parentNode.removeChild(document.getElementById("listaExplicadores"));
	let sessaoMarcada = document.createElement("div");
	sessaoMarcada.id = "sessaoMarcada";
	sessaoMarcada.className = "alert alert-success";
	sessaoMarcada.setAttribute("role", "alert");
	sessaoMarcada.innerHTML = "<b>Sessão marcada</b> com Sucesso.<br>Dia: " + diaSelecionado + "<br>Tempo Início: " + sessionStorage.getItem("tempoInicial") + "<br>Tempo Fim: " + sessionStorage.getItem("tempoFinal");
	document.getElementById("disciplinasAluno").appendChild(sessaoMarcada);
}

function obterDisciplinas() {
	let paragrafo = document.getElementById("formSessao");
	let botao = document.createElement("input");
	botao.setAttribute("type", "button");
	botao.setAttribute("value", "Marcar Sessão");
	botao.setAttribute("id", "submitData");
	botao.setAttribute("class", "bnt btn-success rounded");
	connectDataBase();
	connection.query("SELECT * FROM disciplina", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			let primeiro = true;
			result.forEach((disciplina) => {
				let radio = document.createElement("input");
				radio.setAttribute("type", "radio");
				radio.setAttribute("value", disciplina.id);
				radio.setAttribute("name", "disciplina");
				radio.setAttribute("id", "disciplina_" + disciplina.id);
				let label = document.createElement("label");
				label.setAttribute("for", "disciplina_" + disciplina.id);
				label.innerHTML = " " + disciplina.nome;
				if (primeiro) {
					radio.checked = true;
					primeiro = false;
				}
				paragrafo.appendChild(radio);
				paragrafo.appendChild(label);
				paragrafo.appendChild(document.createElement("br"));
				paragrafo.appendChild(botao);
			});
			closeConnectionDataBase();
		}
	});
	botao.addEventListener("click", function (event) {
		let prevenirSubmit = false;
		let inputData = document.getElementById("inputData");
		console.log(inputData.value);
		sessionStorage.setItem("dataSelecionada", inputData.value);
		let inputTempoInicial = document.getElementById("inputTempoInicial");
		console.log(inputTempoInicial.value);
		sessionStorage.setItem("tempoInicial", inputTempoInicial.value);
		let inputTempoFinal = document.getElementById("inputTempoFinal");
		sessionStorage.setItem("tempoFinal", inputTempoFinal.value);
		console.log(inputTempoFinal.value);
		let radios = document.getElementsByName("disciplina");
		let id_disciplina = -1;
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				id_disciplina = radios[i].value;
				break;
			}
		}
		console.log(id_disciplina);
		if (new Date(inputData.value) < new Date()) {
			console.log("Data passada!");
			prevenirSubmit = true;
		}
		let tempoInicial = parseInt(inputTempoInicial.value.split(":")[0], 10) * 60 + parseInt(inputTempoInicial.value.split(":")[1], 10);
		let tempoFinal = parseInt(inputTempoFinal.value.split(":")[0], 10) * 60 + parseInt(inputTempoFinal.value.split(":")[1], 10);
		if (tempoInicial > tempoFinal) {
			console.log("Tempo Final inferior ao Tempo Inicial!");
			prevenirSubmit = true;
		}
		//  console.log(sessionStorage.getItem("idUser"));
		if (!prevenirSubmit) {
			connectDataBase();
			let query = "SELECT planoAcesso_id FROM explicando WHERE user_id=" + sessionStorage.getItem("idUser");
			var planoAcessoID = -1;
			connection.query(query, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					planoAcessoID = result[0].planoAcesso_id;
					let diaHoje = new Date();
					let diaSelecionado = new Date(inputData.value);
					if (planoAcessoID != -1) {
						query = "SELECT tipo FROM planoacesso WHERE id=" + planoAcessoID;
						// console.log(query);
						connection.query(query, function (err, result) {
							if (err) {
								console.log(err);
							} else {
								if (result[0].tipo == "mensal") {
									if (diaHoje.getMonth() != diaSelecionado.getMonth()) {
										console.log("Fim do plano mensal");
										prevenirSubmit = true;
									}
								} else if (result[0].tipo == "anual") {
									if (diaHoje.getFullYear() != diaSelecionado.getFullYear()) {
										console.log("Fim do plano anual");
										prevenirSubmit = true;
									}
								}
								if (!prevenirSubmit) {
									var diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
									query = "SELECT * FROM periododisponibilidade,disciplina WHERE disciplina.id=" + id_disciplina + " AND disciplina.explicador_user_id=periododisponibilidade.explicador_user_id";
									let explicadoresDisponiveis = [];
									// console.log(query);
									connection.query(query, function (err, result) {
										if (err) {
											console.log(err);
										} else {
											result.forEach((periododisponibilidade) => {
												if (diasSemana[diaSelecionado.getDay()] == periododisponibilidade.diaSemana) {
													let tempoInicialDisponibilidade = parseInt(periododisponibilidade.tempoInicio.split(":")[0], 10) * 60 + parseInt(periododisponibilidade.tempoInicio.split(":")[1], 10);
													let tempoFinalDisponibilidade = parseInt(periododisponibilidade.tempoFim.split(":")[0], 10) * 60 + parseInt(periododisponibilidade.tempoFim.split(":")[1], 10);
													if (tempoInicial > tempoInicialDisponibilidade && tempoFinal < tempoFinalDisponibilidade) {
														query = "SELECT * FROM marcacao WHERE explicador_user_id=" + periododisponibilidade.explicador_user_id;
														// console.log(query);
														connection.query(query, function (err, result) {
															if (err) {
																console.log(err);
															} else {
																// console.log(result);
																result.forEach((sessao) => {
																	let dataSessao = new Date(sessao.data);
																	// console.log(dataSessao);
																	// console.log(diaSelecionado);
																	// console.log(dataSessao.toDateString() === diaSelecionado.toDateString());
																	if (dataSessao.toDateString() === diaSelecionado.toDateString()) {
																		let tempoInicioSessao = parseInt(sessao.tempoInicio.split(":")[0], 10) * 60 + parseInt(sessao.tempoInicio.split(":")[1], 10);
																		let tempoFinalSessao = parseInt(sessao.tempoFinal.split(":")[0], 10) * 60 + parseInt(sessao.tempoFinal.split(":")[1], 10);
																		console.log(sessao.tempoInicio);
																		console.log(sessao.tempoFinal);
																		if ((tempoInicial < tempoInicioSessao && tempoFinal < tempoInicioSessao) || tempoInicial > tempoFinalSessao) {
																			// console.log(explicadoresDisponiveis);
																			if (!explicadoresDisponiveis.includes(periododisponibilidade.explicador_user_id)) {
																				explicadoresDisponiveis.push(periododisponibilidade.explicador_user_id);
																				console.log("VALIDO");
																			}
																		}
																	}
																});
																// closeConnectionDataBase();
															}
														});
													}
												}
											});
											setTimeout(function () {
												let headerListaExplicadores = document.createElement("dt");
												headerListaExplicadores.setAttribute("id", "listaExplicadores");
												headerListaExplicadores.innerHTML = "Explicadores disponíveis";
												// let idExplicador = explicadoresDisponiveis[0];
												if (explicadoresDisponiveis.length > 0) {
													document.getElementById("formSessao").parentNode.removeChild(document.getElementById("formSessao"));
													explicadoresDisponiveis.forEach((explicadorID) => {
														query = "SELECT nome FROM explicador WHERE user_id=" + explicadorID;
														connection.query(query, function (err, result) {
															if (err) {
																console.log(err);
															} else {
																var explicador = document.createElement("li");
																var linkExplicador = document.createElement("a");
																linkExplicador.href = "#";
																linkExplicador.setAttribute("onclick", "inserirSessao(" + explicadorID + "," + id_disciplina + ")");
																linkExplicador.innerHTML = result[0].nome;
																explicador.appendChild(linkExplicador);
																headerListaExplicadores.appendChild(explicador);
																document.getElementById("disciplinasAluno").appendChild(headerListaExplicadores);
																// closeConnectionDataBase();
															}
														});
													});
													// var data_js = {
													// 	access_token: "y2ju54usv2ct8w0shn2jmsnp", // sent after you sign up
													// };
													// function toParams(data_js) {
													// 	var form_data = [];
													// 	for (var key in data_js) {
													// 		form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
													// 	}

													// 	return form_data.join("&");
													// }
													// function js_send() {
													// 	var request = new XMLHttpRequest();
													// 	request.onreadystatechange = function () {
													// 		if (request.readyState == 4 && request.status == 200) {
													// 			console.log("GOOD");
													// 		} else if (request.readyState == 4) {
													// 			console.log("BAD");
													// 		}
													// 	};

													// 	var subject = "Confirmação sessão";
													// 	var message = "Teste";
													// 	data_js["subject"] = subject;
													// 	data_js["text"] = message;
													// 	var params = toParams(data_js);

													// 	request.open("POST", "https://postmail.invotes.com/send", true);
													// 	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

													// 	request.send(params);

													// 	return false;
													// }
													// js_send();
												} else {
													document.getElementById("formSessao").parentNode.removeChild(document.getElementById("formSessao"));
													var explicador = document.createElement("li");
													explicador.innerHTML = "Não há explicadores disponíveis";
													headerListaExplicadores.appendChild(explicador);
													document.getElementById("disciplinasAluno").appendChild(headerListaExplicadores);
												}
											}, 50);
										}
									});
								} else {
									closeConnectionDataBase();
								}
							}
						});
					} else {
						prevenirSubmit = true;
					}
				}
			});
		}
	});
}
