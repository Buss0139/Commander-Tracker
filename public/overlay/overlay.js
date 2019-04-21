
const overlayApp = angular.module('overlayApp', ['firebase']);


overlayApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);


overlayApp.controller('mainController', ['$scope', '$window', '$location', 'DBService', function($scope, $window, $location, DBService){

  let init = function(){
    //Ensure data loads, bind it
    DBService.getPlayerData().then((playerPromises) => {
      Promise.all(playerPromises).then((loadedPlayerData) => {
        let bindingPromises = [];
        $scope.playerData = loadedPlayerData;

        $scope.playerData.forEach((player, index) => {
          let playerBind = player.$bindTo($scope, `playerData[${index}]`);
          bindingPromises.push(playerBind);
        });

        return Promise.all(bindingPromises);
      })
      .then(() => {
        $scope.$apply();
        $scope.setStyles();
        $window.addEventListener('resize', () => {$scope.setStyles(); $scope.$apply();} );
      })
      .catch((error) => {
        console.log("Something when wrong while loading player data!");
        console.log(error);
      });
    }); //End player data loading and binding
  } //End init


  $scope.setStyles = function(){
    let playerCount = $scope.playerData.length;

    const cardHeightPercent = 100 / playerCount; //Individual player info card %vh
    $scope.playerStyle = new Array(playerCount);

    const colors = [
      {border: '#1a237e', background: 'rgb(248,231,185)', stroke:'.1em tan'},
      {border: '#9a0007', background: 'rgb(179,206,234)', stroke:'.1em blue'},
      {border: '#005005', background: 'rgb(166,159,157)', stroke:'.1em black'},
      {border: '#790e8b', background: 'rgb(235,159,130)', stroke:'.1em red'},
      {border: '#b1bfca', background: '#e3f2fd'},
      {border: '#cabf45', background: '#fff176'}
    ];

    for(let i=0; i<playerCount; i++){
      $scope.playerStyle[i] = {
        height: cardHeightPercent + 'vh',
        // border: '8px solid ' + colors[i].border,
        "background-color": colors[i].background,
        "-webkit-text-stroke": colors[i].stroke
      };
    }
  }; //End setStyles


  $scope.applyLifeChange = function(playerIndex, lifeChange){
    $scope.playerData[playerIndex].life += lifeChange;
  };


  $scope.applyCastChange = function(playerIndex, castChange){
    $scope.playerData[playerIndex].castCount += castChange;
  };


  $scope.getNameByID = function(id){
    let player = $scope.playerData.find((p) => { return p.id == id ? true : false; });
    return player.name;
  };


  $scope.incrimentTestPlayer = function(playerIndex){
    console.log(`${playerIndex} from incrimentTestPlayer.`);
    console.log(`${$scope.playerData[playerIndex]}`);
    console.log(`Before: ${$scope.playerData[playerIndex].life}`);
    $scope.playerData[playerIndex].life++;
    console.log(`After: ${$scope.playerData[playerIndex].life}`);
  }

  //Init
  init();
}]);
