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
		} else {
			query = "SELECT * FROM explicando_tem_explicador WHERE explicando_user_id=" + sessionStorage.getItem("idUser") + " AND explicador_user_id=" + idExplicador + " AND disciplina_id=" + id_disciplina;
			connection.query(query, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					if (result.length == 0) {
						query =
							"INSERT INTO explicando_tem_explicador (explicando_user_id, explicador_user_id, notas, disciplina_id) VALUES (" +
							sessionStorage.getItem("idUser") +
							", " +
							idExplicador +
							", NULL, " +
							id_disciplina +
							")";
						console.log(query);
						connection.query(query, function (err) {
							if (err) {
								console.log(err);
							}
						});
					}
					document.getElementById("listaExplicadores").parentNode.removeChild(document.getElementById("listaExplicadores"));
					let sessaoMarcada = document.createElement("div");
					sessaoMarcada.id = "sessaoMarcada";
					sessaoMarcada.className = "alert alert-success";
					sessaoMarcada.setAttribute("role", "alert");
					sessaoMarcada.innerHTML =
						"<b>Sessão solicitada</b> com Sucesso.<br>Pendente a confirmação do explicador.<br>Dia: " + diaSelecionado + "<br>Tempo Início: " + sessionStorage.getItem("tempoInicial") + "<br>Tempo Fim: " + sessionStorage.getItem("tempoFinal");
					document.getElementById("disciplinasAluno").appendChild(sessaoMarcada);
				}
			});
		}
	});
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
			let divGeral = document.createElement("div");
			divGeral.className = "radio";
			let divLinha = document.createElement("div");
			divLinha.className = "row";
			let numeroDisciplinas = result.length;
			let disciplinasPorColuna = Math.floor(numeroDisciplinas / 3);
			console.log(numeroDisciplinas);
			console.log(disciplinasPorColuna);
			let index = 0;
			var divColuna = document.createElement("div");
			divColuna.className = "col-md-4";
			result.forEach((disciplina) => {
				let radio = document.createElement("input");
				radio.setAttribute("type", "radio");
				radio.setAttribute("value", disciplina.id);
				radio.setAttribute("name", "disciplina");
				radio.setAttribute("id", "disciplina_" + disciplina.id);
				let label = document.createElement("label");
				// label.appendChild(radio);
				label.setAttribute("for", "disciplina_" + disciplina.id);
				label.innerHTML = " " + disciplina.nome;
				if (primeiro) {
					radio.checked = true;
					primeiro = false;
				}
				// paragrafo.appendChild(radio);
				// paragrafo.appendChild(label);
				// paragrafo.appendChild(document.createElement("br"));
				// paragrafo.appendChild(botao);
				divColuna.appendChild(radio);
				divColuna.appendChild(label);
				divColuna.appendChild(document.createElement("br"));
				index++;
				if (index % disciplinasPorColuna == 0) {
					divLinha.appendChild(divColuna);
					divColuna = document.createElement("div");
					divColuna.className = "col-md-4";
				}
			});
			divGeral.appendChild(divLinha);
			paragrafo.appendChild(divGeral);
			paragrafo.appendChild(document.createElement("br"));
			paragrafo.appendChild(botao);
			closeConnectionDataBase();
		}
	});
	let erroSessao = document.createElement("div");
	erroSessao.id = "erroMarcar";
	erroSessao.className = "alert alert-danger";
	erroSessao.setAttribute("role", "alert");
	document.getElementById("disciplinasAluno").appendChild(erroSessao);
	$("#erroMarcar").hide();
	botao.addEventListener("click", function (event) {
		let inputData = document.getElementById("inputData");
		console.log(inputData.value);
		if (inputData.value === "") {
			erroSessao.innerHTML = "É preciso selecionar a data.";
			$("#erroMarcar")
				.stop(true, true)
				.fadeTo(5000, 500)
				.slideUp(500, function () {
					$("#erroMarcar").slideUp(500);
				});
			return;
		}
		sessionStorage.setItem("dataSelecionada", inputData.value);
		let inputTempoInicial = document.getElementById("inputTempoInicial");
		console.log(inputTempoInicial.value);
		sessionStorage.setItem("tempoInicial", inputTempoInicial.value);
		if (inputTempoInicial.value === "") {
			erroSessao.innerHTML = "É preciso selecionar o tempo de início.";
			$("#erroMarcar")
				.stop(true, true)
				.fadeTo(5000, 500)
				.slideUp(500, function () {
					$("#erroMarcar").slideUp(500);
				});
			return;
		}
		let inputTempoFinal = document.getElementById("inputTempoFinal");
		sessionStorage.setItem("tempoFinal", inputTempoFinal.value);
		console.log(inputTempoFinal.value);
		if (inputTempoFinal.value === "") {
			erroSessao.innerHTML = "É preciso selecionar o tempo de fim da sessão.";
			$("#erroMarcar")
				.stop(true, true)
				.fadeTo(5000, 500)
				.slideUp(500, function () {
					$("#erroMarcar").slideUp(500);
				});
			return;
		}
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
			// console.log(new Date(inputData.value));
			// console.log(new Date());
			erroSessao.innerHTML = "Só pode marcar sessão em dias futuros.";
			$("#erroMarcar")
				.stop(true, true)
				.fadeTo(5000, 500)
				.slideUp(500, function () {
					$("#erroMarcar").slideUp(500);
				});
			return;
		}
		let tempoInicial = parseInt(inputTempoInicial.value.split(":")[0], 10) * 60 + parseInt(inputTempoInicial.value.split(":")[1], 10);
		let tempoFinal = parseInt(inputTempoFinal.value.split(":")[0], 10) * 60 + parseInt(inputTempoFinal.value.split(":")[1], 10);
		if (tempoInicial > tempoFinal) {
			erroSessao.innerHTML = "O tempo de fim da sessão não pode ser inferior ao tempo de início da sessão.";
			$("#erroMarcar")
				.stop(true, true)
				.fadeTo(5000, 500)
				.slideUp(500, function () {
					$("#erroMarcar").slideUp(500);
				});
			return;
		}
		//  console.log(sessionStorage.getItem("idUser"));
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
									erroSessao.innerHTML = "Não pode solicitar uma sessão após fim do seu plano mensal.";
									$("#erroMarcar")
										.stop(true, true)
										.fadeTo(5000, 500)
										.slideUp(500, function () {
											$("#erroMarcar").slideUp(500);
										});
									closeConnectionDataBase();
									return;
								}
							} else if (result[0].tipo == "anual") {
								if (diaHoje.getFullYear() != diaSelecionado.getFullYear()) {
									console.log("Fim do plano anual");
									erroSessao.innerHTML = "Não pode solicitar uma sessão após fim do seu plano anual.";
									$("#erroMarcar")
										.stop(true, true)
										.fadeTo(5000, 500)
										.slideUp(500, function () {
											$("#erroMarcar").slideUp(500);
										});
									closeConnectionDataBase();
									return;
								}
							}
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
											// console.log(tempoInicialDisponibilidade);
											// console.log(tempoFinalDisponibilidade);
											// console.log(tempoInicial);
											// console.log(tempoFinal);
											if (tempoInicial >= tempoInicialDisponibilidade && tempoFinal <= tempoFinalDisponibilidade && !explicadoresDisponiveis.includes(periododisponibilidade.explicador_user_id)) {
												if (!explicadoresDisponiveis.includes(periododisponibilidade.explicador_user_id)) {
													explicadoresDisponiveis.push(periododisponibilidade.explicador_user_id);
													console.log("VALIDO");
												}
												query = "SELECT * FROM marcacao WHERE explicador_user_id=" + periododisponibilidade.explicador_user_id + " OR explicando_user_id=" + sessionStorage.getItem("idUser");
												console.log(query);
												connection.query(query, function (err, result) {
													if (err) {
														console.log(err);
													} else {
														// console.log(result);
														if (result.length > 0) {
															result.forEach((sessao) => {
																let dataSessao = new Date(sessao.data);
																// console.log(dataSessao);
																// console.log(diaSelecionado);
																// console.log(dataSessao.toDateString() === diaSelecionado.toDateString());
																if (dataSessao.toDateString() === diaSelecionado.toDateString()) {
																	let tempoInicioSessao = parseInt(sessao.tempoInicio.split(":")[0], 10) * 60 + parseInt(sessao.tempoInicio.split(":")[1], 10);
																	let tempoFinalSessao = parseInt(sessao.tempoFinal.split(":")[0], 10) * 60 + parseInt(sessao.tempoFinal.split(":")[1], 10);
																	// console.log(tempoInicial);
																	// console.log(tempoFinal);
																	// console.log(tempoInicioSessao);
																	// console.log(tempoFinalSessao);
																	// console.log(tempoInicial < tempoInicioSessao && tempoFinal < tempoInicioSessao);
																	// console.log(tempoInicial > tempoFinalSessao);
																	if (
																		sessao.explicador_user_id == periododisponibilidade.explicador_user_id &&
																		!((tempoInicial < tempoInicioSessao && tempoFinal < tempoInicioSessao) || tempoInicial > tempoFinalSessao)
																	) {
																		explicadoresDisponiveis.splice(explicadoresDisponiveis.indexOf(periododisponibilidade.explicador_user_id));
																	} else if (
																		!((tempoInicial < tempoInicioSessao && tempoFinal < tempoInicioSessao) || tempoInicial > tempoFinalSessao) &&
																		sessao.explicando_user_id == sessionStorage.getItem("idUser")
																	) {
																		erroSessao.innerHTML = "Não pode solicitar uma sessão na hora de outra sessão já marcada.";
																		$("#erroMarcar")
																			.stop(true, true)
																			.fadeTo(5000, 500);
																		closeConnectionDataBase();
																		return;
																	}
																}
															});
														}
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
						}
					});
				} else {
					closeConnectionDataBase();
					return;
				}
			}
		});
	});
}
