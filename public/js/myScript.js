var myModal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
$(document).ready( function () {

//Global js
// document.getElementById('backButton').addEventListener('click', function() {
//     window.history.back();
//   });

//desctop js

    if($(".d-lg-none")) { 
    $('#expensesTable').DataTable();
}
//mobile js in else






//LAST LINE
} );

$(document).ready(function() {


// Initialize select2 for tags
var $select = $('#tags').select2({
    minimumInputLength: 3, // Only start searching when the user has input 3 or more characters
    ajax: {
        url: '/expenses/tags/api/tags', // The url of your endpoint that handles the search
        dataType: 'json',
        data: function(params) {
            return {
                term: params.term // search term
            };
        }
    },
    tags: true, // Allows the user to create new tags
    selectOnClose: true,
    tokenSeparators: [',', ' '],
    closeOnSelect: true
});


    $select.data('select2').$container.find('input.select2-search__field').on('keyup', function(e) {
        if (e.key === 'Enter') {
            var inputValue = $(this).val(); // Get the input text
            var $existingOption = $select.find('option').filter(function() {
                return $(this).val() === inputValue;
            });

            if (!$existingOption.length) {
                // Create a new option
                var newOption = new Option(inputValue, inputValue, false, true);
                $select.append(newOption).trigger('change');

                // Make AJAX request to create new tag
                $.ajax({
                    type: 'POST',
                    url: '/expenses/tags/api/create',
                    data: { name: inputValue },
                    success: function(response) {
                        console.log('Ajax response'+response); // DEBUG
                        if (response.status === 'success') {
                            console.log('Tag created successfully:', response.message); // DEBUG
                
                            // The server should respond with the ObjectId of the newly created tag
                            var newTagId = response.tagId;
                            console.log('New tag id:', newTagId); // DEBUG
                            // Update the selected tags
                            var selectedTags = $select.val();
                            selectedTags.push(newTagId);
                            $select.val(selectedTags).trigger('change');
                        } else {
                            console.error('Error creating tag:', response.message);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('AJAX error:', textStatus, errorThrown);
                    }
                });

                // Select the new option
                $select.val(inputValue).trigger('change');
            }

            // Reset the search field
            $(this).val('');
        }
    });


});


