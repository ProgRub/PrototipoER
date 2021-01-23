let form = document.getElementById("submitData");
form.addEventListener("click", function (event) {
	let prevenirSubmit = false;
	let inputData = document.getElementById("inputData");
	console.log(inputData.value);
	let inputTempoInicial = document.getElementById("inputTempoInicial");
	console.log(inputTempoInicial.value);
	let inputTempoFinal = document.getElementById("inputTempoFinal");
	console.log(inputTempoFinal.value);
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
								query = "SELECT * FROM periododisponibilidade";
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
													explicadoresDisponiveis.push(periododisponibilidade.explicador_user_id);
													console.log("VALIDO");
												}
											}
										});
										console.log(explicadoresDisponiveis);
										let headerListaExplicadores = document.createElement("dt");
										headerListaExplicadores.innerHTML = "Explicadores disponíveis";
										if (explicadoresDisponiveis.length > 0) {
											explicadoresDisponiveis.forEach((explicadorBD) => {
												var explicador = document.createElement("li");
												explicador.innerHTML = explicadorBD;
												headerListaExplicadores.appendChild(explicador);
											});
											document.getElementById("formSessao").appendChild(headerListaExplicadores);
										} else {
											var explicador = document.createElement("li");
											explicador.innerHTML = "Não há explicadores disponíveis";
											headerListaExplicadores.appendChild(explicador);
											document.getElementById("formSessao").appendChild(headerListaExplicadores);
										}
									}
								});
								
								closeConnectionDataBase();
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
