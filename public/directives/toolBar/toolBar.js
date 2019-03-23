
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controllerAs: 'tb',
    controller: ['$scope', '$element', 'DBService', function($scope, $element, DBService){

      let tb = this;
      tb.test = "UNDER CONSTRUCTION";

      tb.playerData = undefined;
      tb.state = {
        open: false,
        view: undefined
      }

      tb.toggleToolBar = toggleToolBar;
      tb.setActive = setActive;
      tb.toggleMenuModal = toggleMenuModal;

      init();
      function init(){
        //Ensure data loads, bind it
        DBService.getPlayerData().$loaded().then((data) => {
          // console.log(data);
          data.$bindTo($scope, 'tb.playerData').then(() => {
            //Things after data is ready
          });
        }).catch((error) => {
          throw new Error(error);
        });
      }


    // Start toolBarHeader Section
      function toggleToolBar(){
        let $tb =  $element[0].querySelectorAll('#toolBarHeader')[0];
        let $screen = $element[0].querySelectorAll('#toolBarMenuScreen')[0];

        if($tb.classList.contains('open')){
          //Was open, set to closed
          tb.state.open = false;
          tb.state.view = undefined;  //Unload modal partial
          removeActive();  //Remove active class on selected toolBarHeader

          $tb.classList.remove('open');
          $screen.classList.remove('open');

          $tb.classList.add('closed');
          $screen.classList.add('closed');
        } else {
          //Was closed, set to open
          tb.state.open = true;

          $tb.classList.add('open');
          $screen.classList.add('open');

          $tb.classList.remove('closed');
          $screen.classList.remove('closed');
        }
      };


      let tbViews = [
        './directives/toolBar/partials/massModify.html',
        './directives/toolBar/partials/playerSettings.html',
        './directives/toolBar/partials/history.html',
        './directives/toolBar/partials/reset.html',
      ];


      function toggleMenuModal(templateIndex){
        tb.state.view = tbViews[templateIndex];
      }


      function removeActive(){
        let $navSections =  $element[0].querySelectorAll('.active');
        $navSections.forEach((section) => {
          section.classList.remove('active');
        });
      };


       function setActive(e){
         removeActive();
         e.target.classList.add('active');
       };


      tb.navItems = [
        {display: 'Close', action: tb.toggleToolBar},
        {display: 'Mass Modify', action: function(e){ toggleMenuModal(0); setActive(e); }},
        {display: 'Player Settings', action: function(e){ toggleMenuModal(1); setActive(e); }},
        {display: 'History', action: function(e){ toggleMenuModal(2); setActive(e); }},
        {display: 'Reset', action: function(e){ toggleMenuModal(3); setActive(e); }}
      ];
    // End toolBarHeader Section

    // Start massModifyModal Section

      //Init
      let massModify = {};
      tb.massModify = massModify;
      massModify.operator = {type: '-'};  //Initialize value
      massModify.selected = {};

      massModify.modify = function(){
        for(playerID in massModify.selected){
          if(massModify.selected[playerID]){
            //Is checked
            let player = tb.playerData.find((p) => {return p.id === parseInt(playerID);});
            player.life += (massModify.value * (massModify.operator.type === '+' ? 1 : -1));
          }
        }

        toggleToolBar();
      };


    // End massModifyModal Section


    // Start resetModal Section

    let resetModal = {};
    tb.resetModal = resetModal;

    resetModal.reset = function(){
      tb.playerData.forEach((player) => {
        player.castCount = 0;
        player.life = 40;
        player.damage.forEach((opponent) => {
          opponent.damage = 0;
        });
      });

      toggleToolBar();
    };


    resetModal.cancel = function(){
      toggleToolBar();
    };

    //End resetModal Section

    }]  //End Controller
  }
});
