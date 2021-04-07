"use strict";

// Wrap everything in an anonymous function to avoid poluting the global namespace
(function() {

  let removeEventListener;

  // Use the jQuery document ready signal to know when everything has been initialized
  $(document).ready(function() {
    tableau.extensions.initializeAsync({'configure': showChooseSheetDialog}).then(function() {
      const savedSheetName = tableau.extensions.settings.get('sheet');
      if (savedSheetName) {
        loadSelectedMarks(savedSheetName);
      } else {
        showChooseSheetDialog();
      }
    });

    function showChooseSheetDialog() {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    
      const worksheetNames = worksheets.map((worksheet) => {
        return worksheet.name;
      });
      demoHelpers.showDialog(dashboardName, worksheetNames, saveSheetAndLoadSelectedMarks);
    }


    function loadSelectedMarks(worksheetName) {

      if (removeEventListener) {
        removeEventListener();
      }

      $('#selected_marks_title').text(worksheetName);
      const worksheet = demoHelpers.getSelectedSheet(worksheetName);
    
      worksheet.getSelectedMarksAsync().then((marks) => {
          demoHelpers.populateDataTable(marks);
      });


      const marksSelectedEventHandler = (event) => {
        loadSelectedMarks(worksheetName);
      }
      removeEventListener = worksheet.addEventListener(
        tableau.TableauEventType.MarkSelectionChanged, marksSelectedEventHandler);
    }
    
    function saveSheetAndLoadSelectedMarks(worksheetName) {
      tableau.extensions.settings.set('sheet', worksheetName);
      tableau.extensions.settings.saveAsync();
      loadSelectedMarks(worksheetName);
    }
  });

})();