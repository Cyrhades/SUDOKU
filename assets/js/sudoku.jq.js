/*******************************************************************************
 * Classe Js pour résolution de Sudoku
 * Cahllenge proposé par Yoomap
 *
 * @author : LECOMTE Cyril <cyrhades76@gmail.com>
 * @dependencies : jQuery, sudoku
 * @since: 20/10/2016
 * @history : 
 *            - 20/10/2016 Création interface
 *            - 22/10/2016 Résolution du Sudoku
 *            - 28/10/2016 Générateur de grille de Sudoku / amélioration IHM
 *******************************************************************************/

 /**
  * Vide la grille (remise à Zero)
  */
 var allEmptyCase = function()
 {
 	$('.number').val("")
		.removeClass('case_strict')
		.removeClass('case_solution')
		.removeClass('case_user');
 };

/**
 * Ecriture du resultat du sudoku dans la grille
 */
var explodeSudokuString = function(aResult) {
	var i = 0;
	// On boucle sur les lignes
	for (var line = 1; line<=9; line++)	{
		// On boucle sur les colonne
		for (var row = 1; row<=9; row++) {
			if (parseInt(aResult[i]) > 0 && parseInt(aResult[i]) < 10) {
				if ($('#input_'+line+'_'+row).val() != parseInt(aResult[i])) {

					$('#input_'+line+'_'+row).val(parseInt(aResult[i])).addClass('case_solution');
				}
			}
			else {
				// Une case vide
				$('#input_'+line+'_'+row).val("").addClass('case_user');
			}
			i++;
		}
	}
};

/**
 * Converti la grille en chaine
 */
var implodeSudokuString = function()	{
	var sResult = '';
	// On boucle sur les lignes
	for (var line = 1; line<=9; line++)	{
		// On boucle sur les colonne
		for (var row = 1; row<=9; row++) {
			var i = $('#input_'+line+'_'+row).val();
			if (parseInt(i) > 0) {
				sResult += ''+i;
			} else {
				sResult += '.';
			}
		}
	}
	return sResult;
};

/**
 * crée une base pour générer une grille jouable
 */
var implodeRandomSudokuString = function()	{
	var sResult = '';
	var gridBase = [];
	// On va mettre 4 chiffres de 1 à 9 avec comme clef 1 à 81 en random également
	for (var nbNumber = 1; nbNumber<=4; nbNumber++)	{
		gridBase[(Math.floor((81-1)*Math.random())+1)] = (Math.floor((9-1)*Math.random())+1); 
	}

	// On boucle sur les lignes
	for (var line = 1; line<=9; line++)	{
		// On boucle sur les colonne
		for (var row = 1; row<=9; row++) {
			var i = gridBase[(line*row)];
			if (parseInt(i) > 0) {
				sResult += ''+i;
			} else {
				sResult += '.';
			}
		}
	}
	return sResult;
};

/**
 * Genere une grille factice
 */
var cleanGridForNewSudoku = function(aSudoku, iDifficulty) {
	var iNbDelete = 0;
	// On boucle pour vider des cases en fonction de la difficulté choisie
	while (iNbDelete != iDifficulty) {
		var iCase = (Math.floor((81-1)*Math.random())+1);
		if (typeof aSudoku[iCase] != 'undefined') {
			delete aSudoku[iCase];
			iNbDelete++;
		}
	}
	return aSudoku;
};

/**
 * Permet de résoudre le sudoku
 */
var generateSudoku = function(iDifficulty) {
	// On vide le sudoku complet
	allEmptyCase();
	// On crée une chaine à partir de chaque ligne
	var sBase = implodeRandomSudokuString();
	if (sBase.length >= 81) {
		var solver = sudoku_solver()
		var aResult = solver(sBase,1); // On ne prend qu'un seul resultat
		if (typeof aResult[0] != 'undefined') {
			
			if (iDifficulty == 0 || typeof iDifficulty == 'undefined' || isNaN(iDifficulty)) {
				iDifficulty = 35;
			}
			// On complete la grille
			explodeSudokuString(cleanGridForNewSudoku(aResult[0],iDifficulty));
			$('.case_solution').addClass('case_strict').removeClass('case_solution');
		} else {
			// On regénére une nouvelle grille
			generateSudoku(iDifficulty);
		}
	}
};

/**
 * Permet de résoudre le sudoku
 */
var resolveSudoku = function() {
	$('.solution').removeClass('solution');
	// On crée une chaine à partir de chaque ligne
	var sBase = implodeSudokuString();
	
	if (sBase.length >= 81) {
		var solver = sudoku_solver();
		var aResult = solver(sBase,1); // On ne prend qu'un seul resultat
		if (typeof aResult[0] != 'undefined') {
			// On complete la grille
			explodeSudokuString(aResult[0]);
		} else {
			alert('Votre Sudoku ne peut pas être résolu.');
		}
	}
};

/**
 * Création d'une grille (vide) de sudoku
 */
$.fn.createSudokuGrid = function(options) {
	// Options par défaut
	var defaultOptions = {
		size 		: 		'500px',		// Hauteur-Largeur du sudoku
		withData 	: 		true,			// Générer une grille jouable (grille vide si false)
		nbCaseEmpty : 		35,				// Si withData = true, nombre de case à vider (35 Facile)
		inputLevel  : 		'#level',
		btnResolve  :   	'#resolve',
		btnCreateGrid : 	"#generate",
		btnEmptyGrid : 		"#empty"

	};
	
	// Les parametres du sudoku
	var params = $.extend(defaultOptions,  options );

	$(params.btnResolve).on('click', function() {
		resolveSudoku();
	});

	$(params.btnCreateGrid).on('click', function() {
		generateSudoku($(params.inputLevel).val());
	});

	$(params.btnEmptyGrid).on('click', function() {
		allEmptyCase();
	});
	
    this.each(function() {
	    var sEmptySudoku = '';
	    
		// 3 Lignes contenant ...
		for (var line = 1; line<=3; line++)
		{
			sEmptySudoku += '<div class="grid">';
			// ... 3 Bloque contannt eux même ...
			for (var block = 1; block<=3; block++)
			{
				sEmptySudoku += '<div class="block">';
				// ... 9 cases
				for (var square = 1; square<=9; square++)
				{
					var numCol = (square%3 == 0 ? 3 : square%3)+(block*3-3);
					var numLine = ((square > 6 ? 3 : square > 3 ? 2 : 1)+(line*3-3));
					sEmptySudoku += '<div class="case">';
					sEmptySudoku += '<input id="input_'+numLine+'_'+numCol+'" data-row="'+numLine+'" data-col="'+numCol+'" data-block="'+line+''+block+'" class="number" type="text" min="1" max="9" maxlength="1" />';
					sEmptySudoku += '</div>';
				}	
				sEmptySudoku += '</div>'; // Fin de block
			}
			sEmptySudoku += '</div>'; // Fin de line
		}
		// On affiche notre grille sudoku
		$(this).css({width: params.size, height: params.size}).html(sEmptySudoku);

		if (params.withData) {
			generateSudoku(params.nbCaseEmpty);
		}
    });

	// CSS technique (positionne correctement les cases)
	$('div.grid', $(this)).css({width: '100%', height: '33%'});
	$('div.block', $(this)).css({float: 'left',width: '33%', height: '100%'});
	$('div.case', $(this)).css({float: 'left', width: '33%', height: '33%'});
	$('input.number', $(this)).css({width: '100%', height: '100%', 'vertical-align': 'middle', 'text-align':'center'});

    // Action de controle sur les champs
    $('input.number').controlFieldInput()
    	// Prise du focus au survol
	    .on('mouseover',function(){
	    	if (! $(this).hasClass('case_strict') && ! $(this).hasClass('case_solution')) {
				$(this).focus();
			}
	    });

    return this;
};

/**
 * Control la validation d'un champ
 */
 $.fn.controlFieldInput = function() {
 	/**
 	 * La methode de controle de la validite d'un bloc
 	 */
 	var zoneIsCorrect = function(sType, oCurrentObj) {
 		var aNumber = [];
 		var bReturn = true;
		var objCible = $('[data-'+sType+'="'+( $(oCurrentObj).attr('data-'+sType) )+'"]');
		var iCurrentValue = oCurrentObj.val();

		// De base on considére qu'il n'y a pas d'erreur
		objCible.removeClass('error_'+sType);

		// On boucle sur toutes les cibles
		$(objCible).each(function(){
			// Les case peuvent être vide
			if ($(this).val() != '') {
				// On vérifie pas la case elle même
				if ($(this).val() == iCurrentValue 
					&& 
					oCurrentObj.attr("id") != $(this).attr("id")
				) {
					// On marque l'eerur sur tous le block
					objCible.addClass('error_'+sType);
					return; // On stop y a déja une erreur
				} else if(aNumber.indexOf($(this).val()) >= 0) {
					// Il y a une erreur quand même (mais ne provient pas de la donnée courante)
					objCible.addClass('error_'+sType);
				} else {
					aNumber.push($(this).val());
				}
			}
		});
		return bReturn;
 	};

	return this.each(function() {
		// Au focus on sélectionne pour pouvoir remplacer 
		// une valeur sans difficulte
		$(this).on("focus", function(event) {
			$(this).select();
		});

		$(this).on("keypress", function(event) {
			// On ne peut pas modifier le sudoku proposé
			if ($(this).hasClass('case_strict') || $(this).hasClass('case_solution')) {
				return false;
			}
			// Pour valider un champ sa valeur doit être un nombre entre 1 et 9
			var code= event.keyCode ? event.keyCode : event.which;
			// 0 est un chiffre mais pas toléré dans les sudokus
			if (code == 48) {
				$(this).val(''); // On vide le champs si 0
				return false;
			}

			// Ca doit être un chiffre
			return /\d/.test(String.fromCharCode(code));
		});

		// sa valeur  ne doit pas se retrouver sur la même ligne, 
		// ni sur la même colonne, ni dans son bloc.
		$(this).on("keyup", function(event) {
			// On boucle sur le bloc complet
			zoneIsCorrect('block', $(this));
			// On boucle sur la ligne complete
			zoneIsCorrect('row', $(this));
			// On boucle sur la colonne complete
			zoneIsCorrect('col', $(this));
			// On reprend le focus pour le confort de l'utilisateur
			$(this).focus();
		});
	});
};
