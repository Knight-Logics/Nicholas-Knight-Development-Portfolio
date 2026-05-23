let main = {

    variables: {
      turn: 'w',
      selectedpiece: '',
      highlighted: [],
      pieces: {
        w_king: {
          position: '5_1',
          img: '<div class="chess-piece piece-w-king"></div>',
          captured: false,
          moved: false,
          type: 'w_king'
          
        },
        w_queen: {
          position: '4_1',
          img: '<div class="chess-piece piece-w-queen"></div>',
          captured: false,
          moved: false,
          type: 'w_queen'
        },
        w_bishop1: {
          position: '3_1',
          img: '<div class="chess-piece piece-w-bishop"></div>',
          captured: false,
          moved: false,
          type: 'w_bishop'
        },
        w_bishop2: {
          position: '6_1',
          img: '<div class="chess-piece piece-w-bishop"></div>',
          captured: false,
          moved: false,
          type: 'w_bishop'
        },
        w_knight1: {
          position: '2_1',
          img: '<div class="chess-piece piece-w-knight"></div>',
          captured: false,
          moved: false,
          type: 'w_knight'
        },
        w_knight2: {
          position: '7_1',
          img: '<div class="chess-piece piece-w-knight"></div>',
          captured: false,
          moved: false,
          type: 'w_knight'
        },
        w_rook1: {
          position: '1_1',
          img: '<div class="chess-piece piece-w-rook"></div>',
          captured: false,
          moved: false,
          type: 'w_rook'
        },
        w_rook2: {
          position: '8_1',
          img: '<div class="chess-piece piece-w-rook"></div>',
          captured: false,
          moved: false,
          type: 'w_rook'
        },
        w_pawn1: {
          position: '1_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn2: {
          position: '2_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn3: {
          position: '3_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn4: {
          position: '4_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn5: {
          position: '5_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn6: {
          position: '6_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn7: {
          position: '7_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
        w_pawn8: {
          position: '8_2',
          img: '<div class="chess-piece piece-w-pawn"></div>',
          captured: false,
          type: 'w_pawn',
          moved: false
        },
  
        b_king: {
          position: '5_8',
          img: '<div class="chess-piece piece-b-king"></div>',
          captured: false,
          moved: false,
          type: 'b_king'
        },
        b_queen: {
          position: '4_8',
          img: '<div class="chess-piece piece-b-queen"></div>',
          captured: false,
          moved: false,
          type: 'b_queen'
        },
        b_bishop1: {
          position: '3_8',
          img: '<div class="chess-piece piece-b-bishop"></div>',
          captured: false,
          moved: false,
          type: 'b_bishop'
        },
        b_bishop2: {
          position: '6_8',
          img: '<div class="chess-piece piece-b-bishop"></div>',
          captured: false,
          moved: false,
          type: 'b_bishop'
        },
        b_knight1: {
          position: '2_8',
          img: '<div class="chess-piece piece-b-knight"></div>',
          captured: false,
          moved: false,
          type: 'b_knight'
        },
        b_knight2: {
          position: '7_8',
          img: '<div class="chess-piece piece-b-knight"></div>',
          captured: false,
          moved: false,
          type: 'b_knight'
        },
        b_rook1: {
          position: '1_8',
          img: '<div class="chess-piece piece-b-rook"></div>',
          captured: false,
          moved: false,
          type: 'b_rook'
        },
        b_rook2: {
          position: '8_8',
          img: '<div class="chess-piece piece-b-rook"></div>',
          captured: false,
          moved: false,
          type: 'b_rook'
        },
        b_pawn1: {
          position: '1_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn2: {
          position: '2_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn3: {
          position: '3_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn4: {
          position: '4_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn5: {
          position: '5_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn6: {
          position: '6_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn7: {
          position: '7_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        },
        b_pawn8: {
          position: '8_7',
          img: '<div class="chess-piece piece-b-pawn"></div>',
          captured: false,
          type: 'b_pawn',
          moved: false
        }
  
      }
    },
  
    methods: {
      gamesetup: function() {
        console.log('Starting gamesetup...');
        $('.gamecell').attr('chess', 'null');
        let pieceCount = 0;
        for (let gamepiece in main.variables.pieces) {
          const piece = main.variables.pieces[gamepiece];
          console.log(`Placing ${gamepiece} at ${piece.position}`);
          $('#' + piece.position).html(piece.img);
          $('#' + piece.position).attr('chess', gamepiece);
          pieceCount++;
        }
        console.log(`Game setup complete. Placed ${pieceCount} pieces.`);
        
        // Check if white pawn is properly placed
        const whitePawn1 = $('#1_2').attr('chess');
        console.log('White pawn 1 at 1_2:', whitePawn1);
      },
  
      moveoptions: function(selectedpiece) {
  
        let position = { x: '', y: '' };
        position.x = main.variables.pieces[selectedpiece].position.split('_')[0];
        position.y = main.variables.pieces[selectedpiece].position.split('_')[1];
  
        // these options need to be var instead of let
        var options = []; 
        var coordinates = [];
        var startpoint = main.variables.pieces[selectedpiece].position;
        var c1,c2,c3,c4,c5,c6,c7,c8;
  
        if (main.variables.highlighted.length != 0) {
          main.methods.togglehighlight(main.variables.highlighted);
        }
  
        switch (main.variables.pieces[selectedpiece].type) {
          case 'w_king':
  
            if ($('#6_1').attr('chess') == 'null' && $('#7_1').attr('chess') == 'null' && main.variables.pieces['w_king'].moved == false && main.variables.pieces['w_rook2'].moved == false) {
              coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 },{x: 2, y: 0}].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
            } else {
              coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
            }
  
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          case 'b_king':
  
          if ($('#6_8').attr('chess') == 'null' && $('#7_8').attr('chess') == 'null' && main.variables.pieces['b_king'].moved == false && main.variables.pieces['b_rook2'].moved == false) {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 },{x: 2, y: 0}].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          /*
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          */
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          case 'w_queen':
  
            c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
            c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
            c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
            c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
            c5 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
            c6 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
            c7 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
            c8 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
  
            coordinates = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
            
            options = coordinates.slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          case 'b_queen':
            
              c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
              c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
              c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
              c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
              c5 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
              c6 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
              c7 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
              c8 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
    
              coordinates = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
              
              options = coordinates.slice(0);
              main.variables.highlighted = options.slice(0);
              main.methods.togglehighlight(options);
    
              break;
          
          case 'w_bishop':
  
            c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
            c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
            c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
            c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
  
            coordinates = c1.concat(c2).concat(c3).concat(c4);
  
            options = coordinates.slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          
          case 'b_bishop':
  
            c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
            c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
            c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
            c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
  
            coordinates = c1.concat(c2).concat(c3).concat(c4);
  
            options = coordinates.slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
            break;
          case 'w_knight':
  
            coordinates = [{ x: -1, y: 2 },{ x: 1, y: 2 },{ x: 1, y: -2 },{ x: -1, y: -2 },{ x: 2, y: 1 },{ x: 2, y: -1 },{ x: -2, y: -1 },{ x: -2, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
  
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          case 'b_knight':
  
            coordinates = [{ x: -1, y: 2 },{ x: 1, y: 2 },{ x: 1, y: -2 },{ x: -1, y: -2 },{ x: 2, y: 1 },{ x: 2, y: -1 },{ x: -2, y: -1 },{ x: -2, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
  
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
          case 'w_rook':
  
            c1 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
            c2 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
            c3 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
            c4 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
  
            coordinates = c1.concat(c2).concat(c3).concat(c4);
  
            options = coordinates.slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
            
            break;
          case 'b_rook':
          
            c1 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
            c2 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
            c3 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
            c4 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
  
            coordinates = c1.concat(c2).concat(c3).concat(c4);
  
            options = coordinates.slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
            
            break;
          case 'w_pawn':
  
            if (main.variables.pieces[selectedpiece].moved == false) {
  
              coordinates = [{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
  
            }
            else if (main.variables.pieces[selectedpiece].moved == true) {
  
              coordinates = [{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
  
            }
  
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
  
          case 'b_pawn':
  
            // calculate pawn options
            if (main.variables.pieces[selectedpiece].moved == false) {
  
              coordinates = [{ x: 0, y: -1 },{ x: 0, y: -2 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
  
            }
            else if (main.variables.pieces[selectedpiece].moved == true) {
  
              coordinates = [{ x: 0, y: -1 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
                return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
              });
  
            }
  
            options = (main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type)).slice(0);
            main.variables.highlighted = options.slice(0);
            main.methods.togglehighlight(options);
  
            break;
  
        }
      },
  
      options: function(startpoint, coordinates, piecetype) { // first check if any of the possible coordinates is out of bounds;
          
        coordinates = coordinates.filter(val => {
          let pos = { x: 0, y: 0 };
          pos.x = parseInt(val.split('_')[0]);
          pos.y = parseInt(val.split('_')[1]);
  
          if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { // if it is not out of bounds, return the coordinate;
            return val;
          }
        });
  
        switch (piecetype) {
  
          case 'w_king':
  
            coordinates = coordinates.filter(val => {
              return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'b');
            });
  
            break;
          case 'b_king':
          
            coordinates = coordinates.filter(val => {
              return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'w');
            });
  
            break;
          case 'w_knight':
  
            coordinates = coordinates.filter(val => {
              return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'b');
            });
  
            break;
  
          case 'b_knight':
  
            coordinates = coordinates.filter(val => {
              return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'w');
            });
  
            break;
  
          case 'w_pawn':
  
              coordinates = coordinates.filter(val => {
                let sp = { x: 0, y: 0 };
                let coordinate = val.split('_');
  
                sp.x = startpoint.split('_')[0];
                sp.y = startpoint.split('_')[1];
                
                if (coordinate[0] < sp.x || coordinate[0] > sp.x){ // if the coordinate is on either side of the center, check if it has an opponent piece on it;
                  return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'b'); // return coordinates with opponent pieces on them
                } else { // else if the coordinate is in the center;
                  if (coordinate[1] == (parseInt(sp.y) + 2) && $('#' + sp.x + '_' + (parseInt(sp.y) + 1)).attr('chess') != 'null'){
                    // do nothing if this is the pawns first move, and there is a piece in front of the 2nd coordinate;
                  } else {
                    return ($('#' + val).attr('chess') == 'null'); // otherwise return the coordinate if there is no chess piece on it;
                  }
                }
                            
              });
           
            break;
  
          case 'b_pawn':
  
            coordinates = coordinates.filter(val => {
              let sp = { x: 0, y: 0 };
              let coordinate = val.split('_');
  
              sp.x = startpoint.split('_')[0];
              sp.y = startpoint.split('_')[1];
              
              if (coordinate[0] < sp.x || coordinate[0] > sp.x){ // if the coordinate is on either side of the center, check if it has an opponent piece on it;
                return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'w'); // return coordinates with opponent pieces on them
              } else { // else if the coordinate is in the center;
                if (coordinate[1] == (parseInt(sp.y) - 2) && $('#' + sp.x + '_' + (parseInt(sp.y) - 1)).attr('chess') != 'null'){
                  // do nothing if this is the pawns first move, and there is a piece in front of the 2nd coordinate;
                } else {
                  return ($('#' + val).attr('chess') == 'null'); // otherwise return the coordinate if there is no chess piece on it;
                }
              }
            });
  
            break;
        }      
  
        return coordinates;
      },
  
      w_options: function (position,coordinates) {
        
        let flag = false;
        
        coordinates = coordinates.map(function(val){ // convert the x,y into actual grid id coordinates;
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          }).filter(val => {
            let pos = { x: 0, y: 0 };
            pos.x = parseInt(val.split('_')[0]);
            pos.y = parseInt(val.split('_')[1]);
    
            if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { // if it is not out of bounds, return the coordinate;
              return val;
            }
          }).filter(val => { // algorithm to determine line-of-sight movement options for bishop/rook/queen;
            if (flag == false){
              if ($('#' + val).attr('chess') == 'null'){
                console.log(val)
                return val;
              } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
                flag = true;
                console.log(val)
                return val;
              } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
                console.log(val+'-3')
                flag = true;
              }
            }
          });
  
        return coordinates;
        
      },
  
      b_options: function (position,coordinates) {
        
        let flag = false;
        
        coordinates = coordinates.map(function(val){ // convert the x,y into actual grid id coordinates;
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          }).filter(val => {
            let pos = { x: 0, y: 0 };
            pos.x = parseInt(val.split('_')[0]);
            pos.y = parseInt(val.split('_')[1]);
    
            if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { // if it is not out of bounds, return the coordinate;
              return val;
            }
          }).filter(val => { // algorithm to determine line-of-sight movement options for bishop/rook/queen;
            if (flag == false){
              if ($('#' + val).attr('chess') == 'null'){
                return val;
              } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
                flag = true;
                return val;
              } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
                flag = true;
              }
            }
          });
  
        return coordinates;
        
      },
  
      capture: function (target) {
        let selectedpiece = {
          name: $('#' + main.variables.selectedpiece).attr('chess'),
          id: main.variables.selectedpiece
        };

        // Record the capture move in history
        recordMove(main.variables.pieces[selectedpiece.name], selectedpiece.id, target.id, target.name);
        
          //new cell
          $('#' + target.id).html(main.variables.pieces[selectedpiece.name].img);
          $('#' + target.id).attr('chess',selectedpiece.name);
          //old cell
          $('#' + selectedpiece.id).html('');
          $('#' + selectedpiece.id).attr('chess','null');
          //moved piece
          main.variables.pieces[selectedpiece.name].position = target.id;
          main.variables.pieces[selectedpiece.name].moved = true;
          // captured piece
          main.variables.pieces[target.name].captured = true;
          /*
          // toggle highlighted coordinates
          main.methods.togglehighlight(main.variables.highlighted);
          main.variables.highlighted.length = 0;
          // set the selected piece to '' again
          main.variables.selectedpiece = '';
          */
        
      },
  
      move: function (target) {
  
        let selectedpiece = $('#' + main.variables.selectedpiece).attr('chess');
        let fromPosition = main.variables.selectedpiece;
  
        // Record the move in history
        recordMove(main.variables.pieces[selectedpiece], fromPosition, target.id);
  
        // new cell
        $('#' + target.id).html(main.variables.pieces[selectedpiece].img);
        $('#' + target.id).attr('chess',selectedpiece);
        // old cell
        $('#' + main.variables.selectedpiece).html('');
        $('#' + main.variables.selectedpiece).attr('chess','null');
        main.variables.pieces[selectedpiece].position = target.id;
        main.variables.pieces[selectedpiece].moved = true;
  
        /*
        // toggle highlighted coordinates
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
        // set the selected piece to '' again
        main.variables.selectedpiece = '';
        */
      },
  
      endturn: function(){
  
        if (main.variables.turn == 'w') {
          main.variables.turn = 'b';
          
          // toggle highlighted coordinates
          main.methods.togglehighlight(main.variables.highlighted);
          main.variables.highlighted.length = 0;
          // set the selected piece to '' again
          main.variables.selectedpiece = '';
  
          $('#turn .turn-text').html("Black's Turn");
  
          $('#turn').addClass('turnhighlight');
          window.setTimeout(function(){
            $('#turn').removeClass('turnhighlight');
          }, 1500);
  
        } else if (main.variables.turn = 'b'){
          main.variables.turn = 'w';
  
          // toggle highlighted coordinates
          main.methods.togglehighlight(main.variables.highlighted);
          main.variables.highlighted.length = 0;
          // set the selected piece to '' again
          main.variables.selectedpiece = '';
  
          $('#turn .turn-text').html("White's Turn");
  
          $('#turn').addClass('turnhighlight');
          window.setTimeout(function(){
            $('#turn').removeClass('turnhighlight');
          }, 1500);
  
        }
        
        // Check for check, checkmate, or stalemate after turn ends
        setTimeout(function() {
          if (typeof window.isCheckmate !== 'undefined' && window.isCheckmate(main.variables.turn)) {
            window.announceCheckmate(main.variables.turn);
          } else if (typeof window.isStalemate !== 'undefined' && window.isStalemate(main.variables.turn)) {
            window.announceStalemate();
          } else if (typeof window.isKingInCheck !== 'undefined' && window.isKingInCheck(main.variables.turn)) {
            // Show check notification
            const kingInCheckPlayer = main.variables.turn === 'w' ? 'White' : 'Black';
            $('#turn').append(' - Check!').css('color', '#ff6b6b');
            setTimeout(function() {
              $('#turn').text(kingInCheckPlayer + ' Turn').css('color', '');
            }, 3000);
          }
        }, 100); // Small delay to ensure DOM updates are complete

      },      togglehighlight: function(options) {
        options.forEach(function(element, index, array) {
          $('#' + element).toggleClass("green shake-little neongreen_txt");
        });
      },
  
    }
  };
  
  $(document).ready(function() {
    console.log('Document ready - jQuery loaded:', typeof $ !== 'undefined');
    console.log('Number of gamecells found:', $('.gamecell').length);
    
    main.methods.gamesetup();
    
    console.log('Game setup completed');
    console.log('Attaching click handlers to', $('.gamecell').length, 'cells');
  
    $('.gamecell').click(function(e) {
      // Get the correct cell ID - use $(this).attr('id') instead of e.target.id
      const cellId = $(this).attr('id');
      console.log('Click detected on cell:', cellId, 'Target element:', e.target);
      console.log('Current selectedpiece:', main.variables.selectedpiece);
      
      var selectedpiece = {
        name: '',
        id: main.variables.selectedpiece
      };
  
      if (main.variables.selectedpiece == ''){
        selectedpiece.name = $(this).attr('chess');
      } else {
        selectedpiece.name = $('#' + main.variables.selectedpiece).attr('chess');
      }
      
      console.log('Selected piece name:', selectedpiece.name);
      
      var target = {
        name: $(this).attr('chess'),
        id: cellId
      };      console.log('Target piece:', target.name, 'at', target.id);
      console.log('Current turn:', main.variables.turn);
      console.log('Selected piece ID:', main.variables.selectedpiece);
      console.log('Selected piece name:', selectedpiece.name);

      if (main.variables.selectedpiece == '' && target.name.slice(0,1) == main.variables.turn) { // show options
        console.log('Selecting piece for move options');        // moveoptions
        main.variables.selectedpiece = cellId;
        main.methods.moveoptions($(this).attr('chess'));
  
      } else if (main.variables.selectedpiece !='' && target.name == 'null') { // move selected piece piece
        console.log('Attempting to move piece to empty square');
        console.log('Moving piece:', selectedpiece.name, 'from', selectedpiece.id, 'to', target.id);

        if (selectedpiece.name == 'w_king' || selectedpiece.name == 'b_king'){          let t0 = (selectedpiece.name = 'w_king');
          let t1 = (selectedpiece.name = 'b_king');
          let t2 = (main.variables.pieces[selectedpiece.name].moved == false);
          let t3 = (main.variables.pieces['b_rook2'].moved == false);
          let t4 = (main.variables.pieces['w_rook2'].moved == false);
          let t5 = (target.id == '7_8');
          let t6 = (target.id == '7_1');
    
          if (t0 && t2 && t4 &&t6){ // castle w_king
    
            let k_position = '5_1';
            let k_target = '7_1';
            let r_position = '8_1';
            let r_target = '6_1';
    
            main.variables.pieces['w_king'].position = '7_1';
            main.variables.pieces['w_king'].moved = true;
            $('#'+k_position).html('');
            $('#'+k_position).attr('chess','null');
            $('#'+k_target).html(main.variables.pieces['w_king'].img);
            $('#'+k_target).attr('chess','w_king');
    
            main.variables.pieces['w_rook2'].position = '6_1';
            main.variables.pieces['w_rook2'].moved = true;
            $('#'+r_position).html('');
            $('#'+r_position).attr('chess','null');
            $('#'+r_target).html(main.variables.pieces['w_rook2'].img);
            $('#'+r_target).attr('chess','w_rook2');
    
            main.methods.endturn();
    
          } else if (t1 && t2 && t3 && t5){ // castle b_king
    
            let k_position = '5_8';
            let k_target = '7_8';
            let r_position = '8_8';
            let r_target = '6_8';
    
            // w_king
            main.variables.pieces['b_king'].position = '7_8';
            main.variables.pieces['b_king'].moved = true;
            $('#'+k_position).html('');
            $('#'+k_position).attr('chess','null');
            $('#'+k_target).html(main.variables.pieces['b_king'].img);
            $('#'+k_target).attr('chess','b_king');
    
            main.variables.pieces['b_rook2'].position = '6_8';
            main.variables.pieces['b_rook2'].moved = true;
            $('#'+r_position).html('');
            $('#'+r_position).attr('chess','null');
            $('#'+r_target).html(main.variables.pieces['b_rook2'].img);
            $('#'+r_target).attr('chess','b_rook2');
    
            main.methods.endturn();
            
          } else { // move selectedpiece
            if (isValidMove(main.variables.pieces[selectedpiece.name], selectedpiece.id, target.id)) {
              main.methods.move(target);
              main.methods.endturn();
            } else {
              showInvalidMoveMessage(main.variables.pieces[selectedpiece.name], selectedpiece.id, target.id);
              // Clear selection
              $('.gamecell').removeClass('selected green');
              main.variables.selectedpiece = '';
              main.variables.highlighted = [];
            }
          }
    
        } else { // else if selecedpiece.name is not white/black king than move
          
          if (isValidMove(main.variables.pieces[selectedpiece.name], selectedpiece.id, target.id)) {
            main.methods.move(target);
            main.methods.endturn();
          } else {
            showInvalidMoveMessage(main.variables.pieces[selectedpiece.name], selectedpiece.id, target.id);
            // Clear selection
            $('.gamecell').removeClass('selected green');
            main.variables.selectedpiece = '';
            main.variables.highlighted = [];
          }
  
        }
          
      } else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) != target.name.slice(0,1)){ // capture a piece
        
        if (selectedpiece.id != target.id && main.variables.highlighted.indexOf(target.id) != (-1)) { // if it's not trying to capture pieces not in its movement range
          
          // capture
          main.methods.capture(target)
          main.methods.endturn();
          
        }
  
      } else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) == target.name.slice(0,1)){ // toggle move options
  
        // toggle
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
  
        main.variables.selectedpiece = target.id;
        main.methods.moveoptions(target.name);
  
      }
  
    });
  
    $('body').contextmenu(function(e) {
      e.preventDefault();
    });

  // Checkmate and Stalemate Detection Functions
  window.isKingInCheck = function(color) {
    const king = color === 'w' ? 'w_king' : 'b_king';
    const kingPosition = main.variables.pieces[king].position;
    
    // Check if any opponent piece can attack the king
    for (let piece in main.variables.pieces) {
      if (main.variables.pieces[piece].captured) continue;
      
      const pieceColor = main.variables.pieces[piece].type.charAt(0);
      if (pieceColor !== color) { // Opponent piece
        if (window.isValidMove(main.variables.pieces[piece], main.variables.pieces[piece].position, kingPosition)) {
          return true;
        }
      }
    }
    return false;
  };
  
  window.hasLegalMoves = function(color) {
    // Try all possible moves for the current player
    for (let piece in main.variables.pieces) {
      if (main.variables.pieces[piece].captured) continue;
      
      const pieceColor = main.variables.pieces[piece].type.charAt(0);
      if (pieceColor === color) {
        const piecePosition = main.variables.pieces[piece].position;
        
        // Try moving this piece to all squares
        for (let x = 1; x <= 8; x++) {
          for (let y = 1; y <= 8; y++) {
            const targetPosition = `${x}_${y}`;
            
            // Check if this is a valid move
            if (window.isValidMove(main.variables.pieces[piece], piecePosition, targetPosition)) {
              // Simulate the move
              const originalPosition = main.variables.pieces[piece].position;
              const targetPiece = window.getTargetCellChess(targetPosition);
              
              // Temporarily make the move
              main.variables.pieces[piece].position = targetPosition;
              if (targetPiece && targetPiece !== 'null') {
                main.variables.pieces[targetPiece].captured = true;
              }
              
              // Check if king is still in check after this move
              const stillInCheck = window.isKingInCheck(color);
              
              // Undo the move
              main.variables.pieces[piece].position = originalPosition;
              if (targetPiece && targetPiece !== 'null') {
                main.variables.pieces[targetPiece].captured = false;
              }
              
              // If king is not in check after this move, there are legal moves
              if (!stillInCheck) {
                return true;
              }
            }
          }
        }
      }
    }
    return false; // No legal moves found
  };
  
  window.isCheckmate = function(color) {
    return isKingInCheck(color) && !hasLegalMoves(color);
  };
  
  window.isStalemate = function(color) {
    return !isKingInCheck(color) && !hasLegalMoves(color);
  };
  
  window.getTargetCellChess = function(position) {
    return $(`#${position}`).attr('chess');
  };
  
  window.announceCheckmate = function(color) {
    const winner = color === 'w' ? 'Black' : 'White';
    
    // Create checkmate announcement
    const announcement = $(`
      <div class="checkmate-announcement">
        <div class="checkmate-content">
          <div class="game-over-icon">♔</div>
          <h2>Checkmate!</h2>
          <p>${winner} Wins!</p>
          <button id="new-game-checkmate" class="game-btn">New Game</button>
        </div>
      </div>
    `);
    
    $('body').append(announcement);
    
    // Handle new game button
    $('#new-game-checkmate').click(function() {
      location.reload();
    });
  };
  
  window.announceStalemate = function() {
    // Create stalemate announcement
    const announcement = $(`
      <div class="checkmate-announcement">
        <div class="checkmate-content">
          <div class="game-over-icon">⚖️</div>
          <h2>Stalemate!</h2>
          <p>It's a Draw!</p>
          <button id="new-game-stalemate" class="game-btn">New Game</button>
        </div>
      </div>
    `);
    
    $('body').append(announcement);
    
    // Handle new game button
    $('#new-game-stalemate').click(function() {
      location.reload();
    });
  };
    
    // Enhanced Game Features
    window.moveHistory = [];
    let gameState = [];
    let currentTheme = 'default';
    let moveNumber = 1;

    // Move History Functions
    window.recordMove = function(piece, fromPos, toPos, captured = null) {
      const pieceColor = piece.type.charAt(0);
      const pieceType = piece.type.split('_')[1];
      const pieceSymbol = getPieceSymbol(pieceType);
      
      // Calculate proper move number based on color and history
      let moveNumber;
      if (pieceColor === 'w') {
        // White move: count how many complete move pairs + 1
        const completePairs = Math.floor(window.moveHistory.filter(m => m.color === 'b').length);
        moveNumber = completePairs + 1;
      } else {
        // Black move: count how many white moves have been made
        const whiteMoves = window.moveHistory.filter(m => m.color === 'w').length;
        moveNumber = whiteMoves;
      }
      
      const move = {
        number: moveNumber,
        color: pieceColor,
        piece: pieceType,
        from: fromPos,
        to: toPos,
        captured: captured,
        notation: window.generateMoveNotation(pieceType, fromPos, toPos, captured)
      };
      
      window.moveHistory.push(move);
      window.updateMoveHistoryDisplay();
    }
    
    window.getPieceSymbol = function(pieceType) {
      const symbols = {
        'king': '♔', 'queen': '♕', 'rook': '♖', 
        'bishop': '♗', 'knight': '♘', 'pawn': '♙'
      };
      return symbols[pieceType] || '';
    }
    
    window.generateMoveNotation = function(pieceType, fromPos, toPos, captured) {
      const files = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const fromFile = files[parseInt(fromPos.split('_')[0])];
      const fromRank = fromPos.split('_')[1];
      const toFile = files[parseInt(toPos.split('_')[0])];
      const toRank = toPos.split('_')[1];
      
      let notation = '';
      
      // Piece symbol (empty for pawn)
      if (pieceType !== 'pawn') {
        notation += pieceType.charAt(0).toUpperCase();
      }
      
      // Capture notation
      if (captured) {
        if (pieceType === 'pawn') {
          notation += fromFile;
        }
        notation += 'x';
      }
      
      // Destination square
      notation += toFile + toRank;
      
      return notation;
    }
    
    window.updateMoveHistoryDisplay = function() {
      const movesList = $('#moves-list');
      movesList.empty();
      
      // Group moves by actual move number and color
      const movesByNumber = {};
      
      // Organize moves by move number
      for (let move of window.moveHistory) {
        if (!movesByNumber[move.number]) {
          movesByNumber[move.number] = {};
        }
        movesByNumber[move.number][move.color] = move;
      }
      
      // Display moves in order
      const maxMoveNumber = Math.max(...Object.keys(movesByNumber).map(Number));
      for (let i = 1; i <= maxMoveNumber; i++) {
        const moves = movesByNumber[i] || {};
        const whiteMove = moves['w'];
        const blackMove = moves['b'];
        
        const moveEntry = $(`
          <div class="move-pair">
            <span class="move-number">${i}.</span>
            <span class="white-move">${whiteMove ? whiteMove.notation : '...'}</span>
            <span class="black-move">${blackMove ? blackMove.notation : '...'}</span>
          </div>
        `);
        
        movesList.append(moveEntry);
      }
      
      // Auto-scroll to bottom
      movesList.scrollTop(movesList[0].scrollHeight);
    }
    
    // New Game Button
    $('#reset-game').click(function() {
      if (confirm('Start a new game? Current progress will be lost.')) {
        location.reload();
      }
    });
    
    // Undo Move Button
    $('#undo-move').click(function() {
      if (window.moveHistory.length > 0) {
        // Implement undo logic here
        alert('Undo feature coming soon!');
      } else {
        alert('No moves to undo.');
      }
    });
    
    // Theme Toggle Button
    $('#toggle-theme').click(function() {
      toggleTheme();
    });
    
    // Theme Toggle Function
    function toggleTheme() {
      const gameContainer = $('.game-container');
      
      if (currentTheme === 'default') {
        gameContainer.addClass('dark-theme');
        currentTheme = 'dark';
        $(this).text('Light Theme');
      } else {
        gameContainer.removeClass('dark-theme');
        currentTheme = 'default';
        $(this).text('Dark Theme');
      }
    }
    
    // Move History Tracking
    function addMoveToHistory(piece, from, to, captured = null) {
      const moveNumber = Math.ceil((moveHistory.length + 1) / 2);
      const isWhiteMove = moveHistory.length % 2 === 0;
      
      const move = {
        moveNumber: moveNumber,
        piece: piece,
        from: from,
        to: to,
        captured: captured,
        isWhite: isWhiteMove,
        notation: generateNotation(piece, from, to, captured)
      };
      
      moveHistory.push(move);
      updateMoveHistoryDisplay();
    }
    
    // Generate Chess Notation
    function generateNotation(piece, from, to, captured) {
      const pieceSymbols = {
        'king': 'K', 'queen': 'Q', 'rook': 'R', 
        'bishop': 'B', 'knight': 'N', 'pawn': ''
      };
      
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const fromFile = files[parseInt(from.split('_')[0]) - 1];
      const fromRank = from.split('_')[1];
      const toFile = files[parseInt(to.split('_')[0]) - 1];
      const toRank = to.split('_')[1];
      
      const pieceType = piece.split('_')[1];
      const symbol = pieceSymbols[pieceType];
      const captureSymbol = captured ? 'x' : '';
      
      return `${symbol}${fromFile}${fromRank}${captureSymbol}${toFile}${toRank}`;
    }
    
    // Update Move History Display
    function updateMoveHistoryDisplay() {
      const movesList = $('#moves-list');
      movesList.empty();
      
      for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNumber = Math.ceil((i + 1) / 2);
        const whiteMove = moveHistory[i] ? moveHistory[i].notation : '';
        const blackMove = moveHistory[i + 1] ? moveHistory[i + 1].notation : '';
        
        const moveEntry = $(`
          <div class="move-entry">
            <strong>${moveNumber}.</strong> ${whiteMove} ${blackMove}
          </div>
        `);
        
        movesList.append(moveEntry);
      }
      
      // Auto-scroll to bottom
      movesList.scrollTop(movesList[0].scrollHeight);
    }
    
    // Enhanced piece selection with visual feedback
    function enhancePieceSelection(cellId) {
      $('.gamecell').removeClass('selected');
      $('#' + cellId).addClass('selected');
      
      // Add selection sound effect (placeholder)
      playSound('select');
    }
    
    // Sound effects placeholder
    function playSound(soundType) {
      // Implement sound effects here
      // For now, just a console log
      console.log(`Playing sound: ${soundType}`);
    }
    
    // Knight Logics Unique Features
    let gameStats = {
      movesPlayed: 0,
      capturesMade: 0,
      gameStartTime: new Date(),
      timeElapsed: 0
    };



    // Chess Move Validation
    window.isValidMove = function(piece, fromPos, toPos) {
      const pieceType = piece.type.split('_')[1]; // e.g., 'king', 'pawn', etc.
      const pieceColor = piece.type.charAt(0); // 'w' or 'b'
      
      const from = {
        x: parseInt(fromPos.split('_')[0]),
        y: parseInt(fromPos.split('_')[1])
      };
      
      const to = {
        x: parseInt(toPos.split('_')[0]),
        y: parseInt(toPos.split('_')[1])
      };
      
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      
      // Debug logging for pawn moves
      if (pieceType === 'pawn') {
        console.log(`Pawn move validation: ${pieceColor}_pawn from (${from.x},${from.y}) to (${to.x},${to.y}), dx=${dx}, dy=${dy}`);
      }
      
      // Basic validation by piece type
      switch(pieceType) {
        case 'pawn':
          return isValidPawnMove(pieceColor, from, to, dx, dy);
        case 'rook':
          return isValidRookMove(from, to, dx, dy);
        case 'knight':
          return isValidKnightMove(dx, dy);
        case 'bishop':
          return isValidBishopMove(from, to, dx, dy);
        case 'queen':
          return isValidQueenMove(from, to, dx, dy);
        case 'king':
          return isValidKingMove(dx, dy);
        default:
          return false;
      }
    }
    
    function isValidPawnMove(color, from, to, dx, dy) {
      const direction = color === 'w' ? 1 : -1; // White moves up, black moves down
      
      console.log(`Pawn validation: color=${color}, direction=${direction}, from.y=${from.y}, dx=${dx}, dy=${dy}`);
      
      // Forward move
      if (dx === 0) {
        console.log(`Forward move check: dy === direction? ${dy === direction}`);
        if (dy === direction) return true; // One square forward
        
        console.log(`Two square check: is starting position? w:${color === 'w' && from.y === 2}, b:${color === 'b' && from.y === 7}`);
        if ((color === 'w' && from.y === 2) || (color === 'b' && from.y === 7)) {
          console.log(`Two square move check: dy === 2*direction? ${dy === 2 * direction}`);
          return dy === 2 * direction; // Two squares from starting position
        }
      }
      
      // Diagonal capture (we'll assume there's an opponent piece)
      if (Math.abs(dx) === 1 && dy === direction) {
        console.log(`Diagonal capture detected`);
        return true; // Diagonal capture
      }
      
      console.log(`Pawn move rejected`);
      return false;
    }
    
    function isValidRookMove(from, to, dx, dy) {
      return (dx === 0 && dy !== 0) || (dy === 0 && dx !== 0); // Horizontal or vertical
    }
    
    function isValidKnightMove(dx, dy) {
      return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    }
    
    function isValidBishopMove(from, to, dx, dy) {
      return Math.abs(dx) === Math.abs(dy) && dx !== 0; // Diagonal
    }
    
    function isValidQueenMove(from, to, dx, dy) {
      return isValidRookMove(from, to, dx, dy) || isValidBishopMove(from, to, dx, dy);
    }
    
    function isValidKingMove(dx, dy) {
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0);
    }
    
    // Invalid Move Feedback
    function showInvalidMoveMessage(piece, fromPos, toPos) {
      // Create invalid move indicator
      const indicator = $(`
        <div class="invalid-move-indicator">
          <span class="invalid-icon">⚠️</span>
          <span class="invalid-text">Invalid Move!</span>
        </div>
      `);
      
      // Add to game container
      $('.game-container').append(indicator);
      
      // Animate piece back to original position
      const fromSquare = $('#' + fromPos);
      const toSquare = $('#' + toPos);
      
      // Add shake animation to the piece
      toSquare.addClass('shake-invalid');
      
      // Play error sound (placeholder)
      playSound('error');
      
      // Remove indicator and effects after 2 seconds
      setTimeout(() => {
        indicator.fadeOut(300, function() { $(this).remove(); });
        toSquare.removeClass('shake-invalid');
      }, 2000);
      
      console.log(`Invalid move: ${piece.type} cannot move from ${fromPos} to ${toPos}`);
    }
    
    // Game Timer
    function updateGameTimer() {
      const elapsed = Math.floor((new Date() - gameStats.gameStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      gameStats.timeElapsed = elapsed;
      
      // Update display if element exists
      const timerElement = $('#game-timer');
      if (timerElement.length) {
        timerElement.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }
    
    // Start game timer
    setInterval(updateGameTimer, 1000);
    
    // Board Analysis Feature
    function analyzeBoardPosition() {
      const analysis = {
        whitePieces: 0,
        blackPieces: 0,
        materialValue: { white: 0, black: 0 },
        centerControl: { white: 0, black: 0 }
      };
      
      // Piece values for material analysis
      const pieceValues = {
        'pawn': 1, 'knight': 3, 'bishop': 3, 
        'rook': 5, 'queen': 9, 'king': 0
      };
      
      // Count pieces and calculate material
      Object.keys(main.variables.pieces).forEach(pieceKey => {
        const piece = main.variables.pieces[pieceKey];
        if (!piece.captured) {
          const color = piece.type.charAt(0); // 'w' or 'b'
          const pieceType = piece.type.split('_')[1];
          
          if (color === 'w') {
            analysis.whitePieces++;
            analysis.materialValue.white += pieceValues[pieceType] || 0;
          } else {
            analysis.blackPieces++;
            analysis.materialValue.black += pieceValues[pieceType] || 0;
          }
        }
      });
      
      return analysis;
    }
    
    // Highlight squares for learning
    function highlightSquareByName(squareName) {
      // Convert chess notation (like "e4") to grid position
      const file = squareName.charAt(0);
      const rank = squareName.charAt(1);
      const fileNum = file.charCodeAt(0) - 96; // a=1, b=2, etc.
      const squareId = `${fileNum}_${rank}`;
      
      $('.gamecell').removeClass('educational-highlight');
      $(`#${squareId}`).addClass('educational-highlight');
      
      setTimeout(() => {
        $(`#${squareId}`).removeClass('educational-highlight');
      }, 2000);
    }
    
    // Initialize enhanced features
    function initializeEnhancements() {
      // Add game timer to UI
      const gameStatus = $('.game-status');
      gameStatus.prepend(`
        <div class="game-timer-section">
          <div class="timer-display">
            <span class="timer-label">Time:</span>
            <span id="game-timer">00:00</span>
          </div>
        </div>
      `);
      
      // Add keyboard shortcuts
      $(document).keydown(function(e) {
        switch(e.key) {
          case 'Escape':
            // Clear selection
            $('.gamecell').removeClass('selected green');
            main.variables.selectedpiece = '';
            main.variables.highlighted = [];
            break;
          case 'r':
          case 'R':
            if (e.ctrlKey) {
              $('#reset-game').click();
            }
            break;
          case 'z':
          case 'Z':
            if (e.ctrlKey) {
              $('#undo-move').click();
            }
            break;
          case 'a':
          case 'A':
            if (e.ctrlKey) {
              e.preventDefault();
              showAnalysis();
            }
            break;
        }
      });
      
      // Add analysis feature
      function showAnalysis() {
        const analysis = analyzeBoardPosition();
        const materialDiff = analysis.materialValue.white - analysis.materialValue.black;
        const advantage = materialDiff > 0 ? 'White' : materialDiff < 0 ? 'Black' : 'Equal';
        
        alert(`Position Analysis:\n` +
              `White pieces: ${analysis.whitePieces} (${analysis.materialValue.white} points)\n` +
              `Black pieces: ${analysis.blackPieces} (${analysis.materialValue.black} points)\n` +
              `Material advantage: ${advantage} (+${Math.abs(materialDiff)})`);
      }
      
      // Add tooltips to buttons
      $('#reset-game').attr('title', 'Start New Game (Ctrl+R)');
      $('#undo-move').attr('title', 'Undo Last Move (Ctrl+Z)');
      $('#toggle-theme').attr('title', 'Toggle Theme');
      
      // Add analysis button
      $('.game-controls').append(`
        <button id="analyze-position" class="game-btn" title="Analyze Position (Ctrl+A)">
          Analyze
        </button>
      `);
      
      $('#analyze-position').click(showAnalysis);
      
      // Add educational tips
      const tips = [
        "Tip: Control the center squares (e4, e5, d4, d5) for better piece activity!",
        "Tip: Develop knights before bishops in the opening.",
        "Tip: Castle early to protect your king!",
        "Tip: Look for tactics like pins, forks, and skewers.",
        "Tip: In the endgame, activate your king!"
      ];
      
      let tipIndex = 0;
      setInterval(() => {
        console.log(`♞ Chess Tip #${tipIndex + 1}: ${tips[tipIndex]}`);
        tipIndex = (tipIndex + 1) % tips.length;
      }, 30000); // Show tip every 30 seconds
    }
    
    // Initialize when document is ready
    initializeEnhancements();
  
  });