"use strict";

// Wrap everything in an anonymous function to avoid poluting the global namespace
(function() {
  // Use the jQuery document ready signal to know when everything has been initialized
  $(document).ready(function() {
    tableau.extensions.initializeAsync({'configure': showChooseSheetDialog}).then(function() {
      showChooseSheetDialog();
    });

    function showChooseSheetDialog() {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    
      const worksheetNames = worksheets.map((worksheet) => {
        return worksheet.name;
      });
      demoHelpers.showDialog(dashboardName, worksheetNames, loadSelectedMarks);
    }


    function loadSelectedMarks(worksheetName) {
      $('#selected_marks_title').text(worksheetName);
      const worksheet = demoHelpers.getSelectedSheet(worksheetName);
    
      worksheet.getSelectedMarksAsync().then((marks) => {
          demoHelpers.populateDataTable(marks);
      });
    }
    
  });

})();