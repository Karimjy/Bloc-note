'use strict';

angular.module('blocnote.controllers', ['hmTouchEvents','ngSanitize', 'ionic'])
.factory('blocnoteDb', function() {
    var db = new PouchDB('notes');
    return db;
  })
.controller('TimeLineCtrl', function($scope, $sce, $location, $filter, blocnoteDb,  $ionicPopup, $ionicListDelegate) {

	//Initialisation notes
	$scope.notes = [];

	$scope.goToAdd = function(view){
		$location.url(view);
	};

	$scope.getDate = function(){
		$scope.date = new Date();
		return $scope.date;
	};

	$scope.date = $scope.getDate();
	var snippet;

	$scope.dateNumber = function(){
		snippet = $filter('date')($scope.date, 'dd');
		return snippet;
	};

	$scope.dateMonth = function(){
		snippet = $filter('date')($scope.date, 'MMM');
		return snippet;
	};

	$scope.dateYears = function(){
		snippet = $filter('date')($scope.date, 'yyyy');
		return snippet;
	};

	// Ajout de la note dans le tableau
	blocnoteDb.changes({
      live: true,
      onChange: function (change) {
        if (!change.deleted) {
          blocnoteDb.get(change.id, function(err, doc) {
            if (err) console.log(err);
            $scope.$apply(function() { //UPDATE
              for (var i = 0; i < $scope.notes.length; i++) {
                if ($scope.notes[i]._id === doc._id) {
                  $scope.notes[i] = doc;
                  return;
                }
              } // CREATE / READ
              $scope.notes.push(doc);
            });
          })
        }else { //DELETE
          $scope.$apply(function () {
            for (var i = 0; i<$scope.notes.length; i++) {
              if ($scope.notes[i]._id === change.id) {
                $scope.notes.splice(i,1);
              }
            }
          }) 
      	}
      }
    });

	//Création d'une note
	$scope.createNote = function(note){
    note.date = $scope.getDate();
		note.datenumber = $scope.dateNumber();
		note.datemonth = $scope.dateMonth();
		note.dateyears = $scope.dateYears();
    	blocnoteDb.post(angular.copy(note), function(err, res) {

      if (err) console.log(err)
        note.title = "";
  	    note.content = "";
  		  note.tag = "";
  	});
  	console.log("enregitrer");
  	$location.url('/partials/mesnotes.html');
	};

	//Mise a jour de la note
	$scope.update = function (note) {
      blocnoteDb.get(note._id, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          blocnoteDb.put(angular.copy(note), doc._rev, function (err, res) {
            if (err) console.log(err);
          });
        }
      });
    };

    $scope.delete = function(note) {
      blocnoteDb.get(note._id, function (err, doc) {
        blocnoteDb.remove(doc, function (err, res) {});
      });
    };

    $scope.editTitle = function (note) {
      var scope = $scope.$new(true);
      scope.data = { response: note.content} ;
      $ionicPopup.prompt({
        title: 'Note:',
        scope: scope,
        buttons: [
          { text: 'Cancel',  onTap: function(e) { return false; } },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              return scope.data.response
            }
          },
        ]
      }).then(function (newTitle) {
        if (newTitle && newTitle != note.title) {
          note.title = newTitle;
          $scope.update(note);
        }
        $ionicListDelegate.closeOptionButtons();
      });
    };

    $scope.myDrag = function(note) {
    	$scope.editTitle(note);
	};
});