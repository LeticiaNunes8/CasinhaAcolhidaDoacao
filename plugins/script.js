$(function () {
	$('[data-toggle="tooltip"]').tooltip()
  })


$.validator.addMethod("minCurrency", function(value, element, params){
	return this.optional(element) || parseInt(getValue(value)) >= params;
}, 'Currency need greater');

$.validator.addMethod("maxCurrency", function(value, element, params){
	return this.optional(element) || parseInt(getValue(value)) <= params;
}, 'Currency need greater');

$.validator.addMethod("checkCpfCnpj", function(value, element, params){
	if(this.optional(element))
		return true;

	if (/-00$/gm.exec(value) != null) {
		value = value.replace(/-00$/, '');
	}
	value = value.replace(/[^0-9]/g, '');
	if (value.length == 11) {
		var Soma = 0;
		var Resto;

		invalids = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444", "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
		if(invalids.indexOf(value) >= 0) return false;

		for (i=1; i<=9; i++) Soma = Soma + parseInt(value.substring(i-1, i)) * (11 - i);
		Resto = (Soma * 10) % 11;

		if ((Resto == 10) || (Resto == 11))  Resto = 0;
		if (Resto != parseInt(value.substring(9, 10)) ) return false;
		
		Soma = 0;
		for (i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i-1, i)) * (12 - i);
		Resto = (Soma * 10) % 11;
		
		if ((Resto == 10) || (Resto == 11))  Resto = 0;
		return true;
	} else if (value.length == 14){
		invalids = ["00000000000000", "11111111111111", "22222222222222", "33333333333333", "44444444444444", "55555555555555", "66666666666666", "77777777777777", "88888888888888", "99999999999999"];
		if(invalids.indexOf(value) >= 0) return false;

		// Valida DVs
		tamanho = value.length - 2
		numeros = value.substring(0, tamanho);
		digitos = value.substring(tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0))
			return false;

		tamanho = tamanho + 1;
		numeros = value.substring(0, tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1))
			return false;

		return true;
	} else if (value.length == 9) {
		return true;
	} else {
		return false;
	}
}, 'Documento inválido');

function brandLogo(state) {
	return $('<img src="img/brand/' + state.text + '" />');
}

function getBrand(number){
	number = number.replace(/^0-9/g, number);
	// visa
	var re = new RegExp("^4");
	if (number.match(re) != null)
		return "visa";

	// Mastercard 
	re = new RegExp("^(5[1-5][0-9]|2(22[1-9][0-9]|2[3-9][0-9]|[3-6][0-9]|7[0-1][0-9]|720[0-9]))");
	if (number.match(re) != null)
		return "mastercard";

	// AMEX
	// re = new RegExp("^3[47]");
	// if (number.match(re) != null)
	// 	return "american_express";

	// Discover
	re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
	if (number.match(re) != null)
		return "discover";

	// Diners
	re = new RegExp("^36");
	if (number.match(re) != null)
		return "diners_club";

	// Diners - Carte Blanche
	re = new RegExp("^30[0-5]");
	if (number.match(re) != null)
		return "diners_club";

	// JCB
	re = new RegExp("^35(2[89]|[3-8][0-9])");
	if (number.match(re) != null)
		return "jcb";

	// Visa Electron
	re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
	if (number.match(re) != null)
		return "visa";

	return "";
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function getValue(value){
	return parseFloat(value.replace(/[^0-9,]/g, '').replace(',', '.')).toFixed(2);
}

opcoes = [
	{
		'bandeira': 'visa',
		'imagem': 'visa.svg',
		'debito': true
	},
	{
		'bandeira': 'mastercard',
		'imagem': 'mastercard.svg',
		'debito': true
	},
	// {
	// 	'bandeira': 'american_express',
	// 	'imagem': 'american-express.svg',
	// 	'debito': false
	// },
	{
		'bandeira': 'elo',
		'imagem': 'elo.svg',
		'debito': false
	},
	{
		'bandeira': 'diners_club',
		'imagem': 'diners-club.svg',
		'debito': false
	},
	{
		'bandeira': 'discover',
		'imagem': 'discover.svg',
		'debito': false
	},
	{
		'bandeira': 'jcb',
		'imagem': 'jcb.svg',
		'debito': false
	},
	{
		'bandeira': 'aura',
		'imagem': 'aura.svg',
		'debito': false
	}
];

$(document).ready(function(){

	//comum
	$nome           = $("input[name='nome']");
	$email          = $("input[name='email']");
	$valor          = $("input[name='valor']");
	$cpf            = $("input[name='cpf']");
	$celular        = $("input[name='celular']");
	$termos         = $("input[name='termos']");
	$nascimento    	= $("input[name='nascimento']");
	$sexo 			= $("select[name='sexo']");
	// $perfil 		= $("select[name='perfil']"); // se tiver perfil
	// $indicado 	= $("input[name='indicado']"); // se tiver indicação
	// $unidade 	= $("input[name='unidade']"); // se tiver unidade consumidora
	//cartão
	$periodicidade 	= $("button[name='periodicidade']");
	$bandeiras_aceitas 	= $("button[name='bandeiras_aceitas']");
	$cartao        	= $("input[name='cartao']");
	$bandeira 		= $("select[name='bandeira']");
	$nome_impresso  = $("input[name='nome_impresso']");
	$validade      	= $("input[name='validade']");
	$codigo        	= $("input[name='codigo']");
	$cpf_portador   = $("input[name='cpf_portador']");
	//boleto
	$cep           	= $("input[name='cep']");
	$endereco      	= $("input[name='endereco']");
	$numero        	= $("input[name='numero']");
	$complemento    = $("input[name='complemento']");
	$cidade        	= $("input[name='cidade']");
	$bairro        	= $("input[name='bairro']");
	$vencimento     = $("input[name='vencimento']");
	$uf 			= $("select[name='uf']");
    $iframe         = $(".iframe-boleto");
	//conta
	$banco 			= $("select[name='banco']");
	$cpf_conta 		= $("input[name='cpf_conta']");
	$nome_conta 	= $("input[name='nome_conta']");
	$agencia 		= $("input[name='agencia']");
	$conta 			= $("input[name='conta']");
	$digito 		= $("input[name='digito']");
	$debito 		= $("select[name='debito']");
	//doar
	$doar 			= $("button[type='submit']");
	$loading 		= '<i class="fa fa-spinner fa-spin"></i>';
	//general
	$link 			= "https://digital.doacaosolutions.com.br/";
	$id 			= 'EEC45CB6-BC0A-4BA2-8115-D6C3EAAFE5C7';

	$(":input").inputmask();

	$(".cpf_cnpj").inputmask({
		mask: ['999.999.999-99', '99.999.999/9999-99'],
		placeholder: '0',
		keepStatic: true
	});

	$("body").on("click", ".valor_doacao", function() {
		$(".valor_doacao").removeClass("active");
		$(this).addClass("active");
		if($(this).val().length)
			$valor.val($(this).val());
         document.querySelector('#voce-esta-doando').innerHTML = $valor.val()
	});

   document.querySelector('#voce-esta-doando').innerHTML = $valor.val()
   $('.outro_valor').on('change', function(){
		document.querySelector('#voce-esta-doando').innerHTML = $valor.val()
	})


	$('#btn-continuar').on('click', function(){

		if($nome.val() == ''){
			swal({
				title: 'O campo nome é obrigatorio',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else if($email.val() == ''){
			swal({
				title: 'O campo email é obrigatorio',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else if($nascimento.val() == ''){
			swal({
				title: 'O campo data de nascimento é obrigatorio',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else if($cpf.val() == ''){
			swal({
				title: 'O campo CPF/CNPJ é obrigatorio',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else if($celular.val()==''){
			swal({
				title: 'O campo telefone é obrigatorio',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else if(!document.querySelector("input[name='termos']").checked){
			swal({
				title: 'O termos são obrigatorios',
				confirmButtonColor: "#66BB6A",
				type: "error"
			});
		}else{
			$('#div-form-pagamento').removeClass('d-none')
			$('#formas-pagamento').removeClass('d-none')
		}
	})

	$("body").on("click", ".valor_doacao", function() {
		$(".valor_doacao").removeClass("active");
		$(this).addClass("active");
		if($(this).val().length)
			$valor.val($(this).val());
	});

	$(".simple-select2").each(function(){
		simpleParent = $(this).parent();
		$(this).select2({
			minimumResultsForSearch: -1,
			dropdownParent: simpleParent
		})
	})

	$(".filter-select2").each(function(){
		filterParent = $(this).parent();
		$(this).select2({
			dropdownParent: filterParent
		});
	})

	$(".brand-select2").each(function(){
		brandParent = $(this).parent();
		$(this).select2({
			templateResult: brandLogo,
			templateSelection: brandLogo,
			dropdownParent: brandParent
		});
	})

    $.ajax({
        type: 'GET',
        url: $link + '/banco'
    }).then(function(data) {
        bancos = data.bancos;
        for(i = 0; i < bancos.length; i++){
            var option = new Option(JSON.stringify(bancos[i]), bancos[i].cod, false, false);
            $(".bank-select2").each(function(){
                $(this).append(option);
            });
        }
 
        function bankLogo(state) {
            try {
                banco = JSON.parse(state.text);
                return $('<img src="' + banco.img + '" title="' + banco.txt + '" />');
            }catch(err){
                return null;
            }
        }
 
        $(".bank-select2").each(function(){
            bankParent = $(this).parent();
            $(this).select2({
                templateResult: bankLogo,
                templateSelection: bankLogo,
                dropdownParent: bankParent
            });
        })
    });

	$("input[type='checkbox']").iCheck({
		checkboxClass: 'icheckbox_square-grey',
		radioClass: 'iradio_square-grey',
		increaseArea: '20%' // optional
	});

	$("input[type='radio']").iCheck({
		checkboxClass: 'icheckbox_square-grey',
		radioClass: 'iradio_square-grey',
		increaseArea: '20%' // optional
	});

	$cartao.keyup(function(){
		$bandeira.val(getBrand($(this).val())).trigger("change.select2");
	});

	$bandeiras_aceitas.click(function(){
		if(!$(this).hasClass("selected"))
			$bandeiras_aceitas.toggleClass("selected");
	});

	$("a.nav-link").click(function(){
		$bandeira.empty();
		for (var i = 0; i < opcoes.length; i++) {
			if ($(this).attr("id") == "credito" && !opcoes[i].credito){
				continue;
			}
			var option = new Option(opcoes[i].imagem, opcoes[i].bandeira, false, false);
			$bandeira.append(option);
		}
		$bandeira.trigger('change');
		if ($(this).attr("id") == "credito" || $(this).attr("id") == "conta_bancaria"){
			$("#bandeiras_aceitas").addClass("d-none");
			// $("#avulso").addClass("selected");
			// $("#recorrente").removeClass("selected");
		} else {
			$("#bandeiras_aceitas").removeClass("d-none");
			// $("#recorrente").addClass("selected");
			// $("#avulso").removeClass("selected");
		}
	});


	$periodicidade.click(function(){
		if(!$(this).hasClass("selected"))
			$periodicidade.toggleClass("selected");
	});

	$("a.nav-link").click(function(){
		$bandeira.empty();
		for (var i = 0; i < opcoes.length; i++) {
			if ($(this).attr("id") == "debito" && !opcoes[i].debito){
				continue;
			}
			var option = new Option(opcoes[i].imagem, opcoes[i].bandeira, false, false);
			$bandeira.append(option);
		}
		$bandeira.trigger('change');
		if ($(this).attr("id") == "debito" || $(this).attr("id") == "conta_bancaria"){
			$("#periodicidade").addClass("d-none");
			// $("#avulso").addClass("selected");
			// $("#recorrente").removeClass("selected");
		} else {
			$("#periodicidade").removeClass("d-none");
			// $("#recorrente").addClass("selected");
			// $("#avulso").removeClass("selected");
		}
	});

	$("a.nav-link").eq(0).trigger("click");

	var cep_anterior = null; // pra evitar requisições repetidas
	$cep.on("keyup blur paste", function(){

		cep = $(this).val().replace(/[^0-9]/g, '');
		if(cep.length != 8)
			return false;

		if(cep_anterior == cep)
			return false;

		$.ajax({
			url: "https://viacep.com.br/ws/" + cep + "/json/",
			method: "GET",
			dataType: "JSON",
			success: function(response){
				$endereco.val(response.logradouro);
				$bairro.val(response.bairro);
				$cidade.val(response.localidade);
				$uf.val(response.uf).trigger("change.select2");
				$numero.focus();
			}
		});

		cep_anterior = cep;

	});

	vcto = new Date();
	$vencimento.val(padLeft(vcto.getDate(), 2) + '/' + padLeft(vcto.getMonth() + 1, 2) + '/' + vcto.getFullYear());
	vcto.setDate(vcto.getDate() + 7);
	$debito.val(vcto.getDate()).trigger("change.select2");

	$("#action").validate({
		rules: {
			nome: {
				required: true,
				minlength: 10
			},
			email: {
				required: true,
				email: true
			},
			valor: {
				required: true,
				minCurrency: 20,
            maxCurrency: 2000
			},
			cpf: {
				required: true,
				checkCpfCnpj: true
			},
			celular: {
				required: true,
				pattern: /^(\([0-9]{2}\) [0-9]{5}-[0-9]{4})$/
			},
			termos: {
				required: true
			},
			nascimento: {
				required: true,
				pattern: /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](19|20)[0-9]{2}$/
			},
			sexo: {
				required: true,
				pattern: /^(feminino|masculino)$/
			},
			// perfil: { // se tiver perfil
			// 	required: true
			// },
			// indicado: { // se tiver indicação e for um campo obrigatório
			// 	required: true,
			// 	pattern: /^(Amor|Saúde|Paz|Alegria)$/, // se houver indicações fixas
			// 	minlength: 5 // se o usuário puder informar a indicação
			// },
			// unidade: { // se tiver unidade consumidora
			// 	required: true,
			// 	minlength: 5
			// },
			cartao: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				minlength: 15
			},
			bandeira: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				pattern: /^(visa|mastercard|elo|diners_club|discover|jcb|aura)$/
			},
			nome_impresso: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				minlength: 10
			},
			validade: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				minlength: 9,
				maxlength: 9
			},
			codigo: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				minlength: 3,
				maxlength: 4
			},
			cpf_portador: {
				required: {
					depends: function(element){
						return $("#credito, #debito").hasClass("active");
					}
				},
				checkCpfCnpj: true
			},
			cep: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				minlength: 9,
				maxlength: 9
			},
			endereco: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				minlength: 3,
				maxlength: 150
			},
			numero: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				maxlength: 10,
				number: true
			},
			cidade: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				minlength: 3,
				maxlength: 150
			},
			bairro: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				minlength: 3,
				maxlength: 150
			},
			vencimento: {
				required: {
					depends: function(element){
						return $("#boleto").hasClass("active");
					}
				},
				pattern: /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](19|20)[0-9]{2}$/
			},
			uf: {
				required: {
					depends: function (element) {
						return $("#boleto").hasClass("active");
					}
				},
				pattern: /^(AC|AL|AM|AP|BA|CE|DF|ES|GO|MA|MG|MS|MT|PA|PB|PE|PI|PR|RJ|RN|RO|RR|RS|SC|SE|SP|TO)$/
			},
			banco: {
				required: {
					depends: function(element){
						return $("#conta_bancaria").hasClass("active");
					}
				},
				pattern: /^(341)$/
			},
			cpf_conta: {
				required: {
					depends: function (element) {
						return $("#conta_bancaria").hasClass("active");
					}
				},
				checkCpfCnpj: true
			},
			nome_conta: {
				required: {
					depends: function (element) {
						return $("#conta_bancaria").hasClass("active");
					}
				},
				minlength: 10
			},
			agencia: {
				required: {
					depends: function (element) {
						return $("#conta_bancaria").hasClass("active");
					}
				},
				pattern: /^[0-9]{4,8}$/
			},
			conta: {
				required: {
					depends: function (element) {
						return $("#conta_bancaria").hasClass("active");
					}
				},
				pattern: /^[0-9]{5,19}[a-zA-Z]?$/
			},
			debito: {
				required: {
					depends: function (element) {
						return $("#conta_bancaria").hasClass("active");
					}
				},
				pattern: /^([1-9]|[12][0-9]|3[01])$/
			}
		},
		messages: {
			nome: {
				required: "Por favor, preencha o campo nome",
				minlength: "Informe o nome completo"
			},
			email: {
				required: "Por favor, preencha o campo e-mail",
				email: "Informe um endereço de e-mail válido"
			},
			valor: {
				required: "Por favor, preencha o campo valor",
				minCurrency: "O valor não pode ser menor que R$ 20,00",
				maxCurrency: "O valor não pode ser maior que R$ 2.000,00"
			},
			cpf: {
				required: "Por favor, preencha o campo documento",
				checkCpfCnpj: "Informe um documento válido (CPF, CNPJ, SIN, SSN, NIF)"
			},
			celular: {
				required: "Por favor, preencha o campo celular",
				pattern: "Informe o número de celular completo"
			},
			termos: {
				required: "Você precisa aceitar os termos e condições para prosseguir",
			},
			nascimento: {
				required: "Por favor, preencha o campo data de nascimento",
				pattern: "A data de nascimento não é válida"
			},
            sexo: {
                pattern: "O sexo precisa ser \"Masculino\" ou \"Feminino\""
			},
			// perfil: { // se tiver perfil
			// 	pattern: "Por favor, selecione uma causa para direcionarmos sua doação"
			// },
			// indicado: { // se tiver indicação e for um campo obrigatório
			// 	required: "Por favor, preencha quem te indicou",
			// 	pattern: "O grupo informado não é um válido", // se houver indicações fixas
			// 	minlength: "O campo de indicação não pode conter menos que 5 caracteres" // se o usuário puder informar a indicação
			// },
			// unidade: { // se tiver unidade consumidora
			// 	required: "Por favor, preencha o campo \"Unidade consumidora\"",
			// 	minlength: "O código não pode ser menor que 5 caracteres"
			// },
			cartao: {
				required: "Por favor, preencha o campo número do cartão",
				minlength: "Informe o número do cartão"
			},
            bandeira: {
                required: "Por favor, informe um cartão válido",
                pattern: "São aceitas as bandeiras Visa, Mastercard, Elo, Diners Club, Discover, JCB e Aura"
			},
			nome_impresso: {
				required: "Por favor, preencha o campo nome impresso no cartão",
				minlength: "Informe o nome como está no cartão"
			},
			validade: {
				required: "Por favor, preencha o campo validade do cartão",
				minlength: "Informe o ano com 4 dígitos",
				maxlength: "Informe o ano com 4 dígitos"
			},
			codigo: {
				required: "Por favor, preencha o campo código de segurança do cartão",
				minlength: "Informe o código de segurança do cartão",
				maxlength: "Informe o código de segurança do cartão (procure no verso do seu cartão)"
			},
			cpf_portador: {
				required: "Por favor, preencha o campo CPF do portador do cartão",
				checkCpfCnpj: "Informe um CPF válido para o portador do cartão"
			},
			cep: {
				required: "Por favor, preencha o campo CEP",
				minlength: "O campo CEP não pode ser menor que 8 caracteres numéricos",
				maxlength: "O campo CEP não pode ser maior que 8 caracteres numéricos"
			},
			endereco: {
				required: "Por favor, preencha o campo endereço",
				minlength: "O campo endereço não pode ser menor que 3 caracteres",
				maxlength: "O campo endereço não pode ser maior que 150 caracteres"
			},
			numero: {
				required: "Por favor, preencha o campo número do seu endereço",
				maxlength: "O campo número não pode ser maior que 10 dígitos",
				number: "O campo número só pode conter caracteres numéricos"
			},
			cidade: {
				required: "Por favor, preencha o campo cidade",
				minlength: "O campo cidade não pode ser menor que 3 caracteres",
				maxlength: "O campo cidade não pode ser maior que 150 caracteres"
			},
			bairro: {
				required: "Por favor, preencha o campo bairro",
				minlength: "O campo bairro não pode ser menor que 3 caracteres",
				maxlength: "O campo bairro não pode ser maior que 150 caracteres"
			},
			vencimento: {
				required: "Por favor, informe a data de vencimento do boleto",
				pattern: "Por favor, informe uma data de vencimento válida"
			},
			uf: {
				required: "Por favor, preencha o campo UF",
				pattern: "O campo UF deve ser uma Unidade da Federação válida (SP, RJ, CE, etc)"
			},
			banco: {
				required: "O banco precisa ser fornecido",
				pattern: "No momento aceitamos apenas o Itaú para débito em conta"
			},
			cpf_conta: {
				required: "O CPF do titular da conta é obrigatório para esse tipo de pagamento",
				checkCpf: "Por favor, forneça um CPF válido"
			},
			nome_conta: {
				required: "O nome do titular da conta é obrigatório para esse tipo de pagamento",
				minlength: "Por favor, forneça o nome completo do titular"
			},
			agencia: {
				required: "A gência da conta é obrigatória",
				pattern: "Por favor, forneça um número de agência válida"
			},
			conta: {
				required: "O número da conta é obrigatório",
				pattern: "Por favor, forneça um número de conta válido"
			},
			debito: {
				required: "O dia do débito é obrigatório",
				pattern: "Por favor, forneça um dia válido"
			}
		},
		submitHandler: function(e){

			$doar.attr("disabled", true);
			$doar.html($loading);

			$token = grecaptcha.getResponse();
			if($token.length == 0){

		        swal({
		            title: "Você precisar comprovar que não é um robô!",
		            confirmButtonColor: "#66BB6A",
		            type: "error"
		        });

				$doar.attr("disabled", false);
				$doar.html("Doar");
		        return false;

			}

			obj = {
				versao 			: 1.0,
				id 				: $id,
				captcha 		: $token,
				cpf 			: $cpf.val().replace(/[^0-9]/g, ''),
				nome 			: $nome.val(),
				email 			: $email.val(),
				valor 			: getValue($valor.val()),
				celular 		: $celular.val().replace(/[^0-9]/g, ''),
				data_nascimento	: $nascimento.val().replace(/[^0-9\/]/g, ''),
				sexo 			: 'outro',
				perfil:         '380001621', //se tiver perfil colocar aqui e descomentar a linha
				// metadados 		: { se tiver unidade consumidora e/ou indicação
				// 	unidade_consumidora	: $unidade.val(), // se tiver unidade consumidora
				// 	indicado_por 		: $indicado.val(), // se tiver indicação
				// },
				forma_pagamento	: $(".nav-link.active").attr("id"),
				recorrente 		: $("#periodicidade button.selected").attr("id") == "recorrente"
			};

			if(obj.forma_pagamento == 'boleto'){

				obj['cep'] 			= $cep.val().replace(/[^0-9]/g, '');
				obj['endereco'] 	= $endereco.val();
				obj['numero'] 		= $numero.val().replace(/[^0-9]/g, '');
				obj['complemento']  = $complemento.val();
				obj['uf'] 			= $uf.val().replace(/[^a-zA-Z]/g, '');
				obj['cidade'] 		= $cidade.val();
				obj['bairro'] 		= $bairro.val();
				obj['vencimento'] 	= $vencimento.val();

			} else if (obj.forma_pagamento == 'conta_bancaria') {

				var conta = $digito.val().length ? $conta.val() + "-" + $digito.val() : $conta.val();

				obj['banco'] 			= $banco.val().replace(/[^0-9]/g, '');
				obj['cpf_portador'] 	= $cpf_conta.val().replace(/[^0-9]/g, '');
				obj['nome_conta'] 		= $nome_conta.val();
				obj['agencia'] 			= $agencia.val().replace(/[^0-9]/g, '');
				obj['conta'] 			= conta.replace(/[^0-9a-zA-Z\-]/g, '');
				obj['dia_debito'] 		= $debito.val().replace(/[^0-9]/g, '');
				obj['recorrente'] 		= true;

			} else {

				obj['nome_impresso']    = $nome_impresso.val();
				obj['cartao']    		= $cartao.val().replace(/[^0-9]/g, '');
				obj['validade']  		= $validade.val().replace(/[^0-9\/]/g, '');
				obj['codigo']    		= $codigo.val().replace(/[^0-9]/g, '');
				obj['bandeira']  		= $bandeira.val().replace(/[^a-zA-Z_]/g, '');
				obj['cpf_portador'] 	= $cpf_portador.val().replace(/[^0-9]/g, '');

			}

			$.ajax({
				url: $link,
				method: "POST",
				dataType: "JSON",
				data: JSON.stringify(obj),
				success: function(response){

					$doar.attr("disabled", false);
					$doar.html("Doar");

					grecaptcha.reset();
					
					if (response.debito){
						$.fancybox.open([
							{
								type: "iframe",
								src: response.debito
							}
						]); 
						window.addEventListener("message", function(event) {
							console.log(event);
							if (event.origin !== "https://apids-sandbox.doacaosolutions.com.br" && event.origin !== "https://apids.doacaosolutions.com.br")
								return;

							swal({
								title: event.data.message,
								confirmButtonColor: "#66BB6A",
								type: event.data.success ? "success" : "error"
							});

							$.fancybox.close();

							if (response.success) {
								$("#action")[0].reset();
								$(".input-field label").addClass("active");
								$(".icheckbox_square-blue").removeClass("checked");
							}
						}, false);
					} else {
						swal({
							title: response.message,
							confirmButtonColor: "#66BB6A",
							type: response.success ? "success" : "error"
						});
						if (response.boleto) {
							var element = document.createElement('a');
							element.setAttribute('href', response.boleto);
							element.setAttribute('download', $nome.val());
							element.style.display = 'none';
							document.body.appendChild(element);
							element.click();
							document.body.removeChild(element);

                            var iframe = $("<iframe/>");
                            iframe.attr("src", response.boleto);
                            $(".iframe-boleto").prepend(iframe);
							$(".iframe-boleto").removeClass("d-none");
							$('html, body').animate({
								scrollTop: $(".iframe-boleto").offset().top
							}, 500);
							
							$(".iframe-fechar").click(function(){
								$(".iframe-boleto").addClass("d-none");
								$(".iframe-boleto").find("iframe").remove();
							});
						}

						if (response.success) {
							$("#action")[0].reset();
							$(".input-field label").addClass("active");
							$(".icheckbox_square-blue").removeClass("checked");
						}
					}
				}
			});

			return false;

		}
	});

	$('#data_ano').html(new Date().getFullYear())

});