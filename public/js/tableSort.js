$(document).ready(function() {
    let currentSortField = "";
    let currentSortDirection = "asc"; // Default sort direction

    $('thead').on('click', 'th[data-sort]', function(e) {
        const sortField = $(this).data('sort');

        if (currentSortField === sortField) {
            currentSortDirection = (currentSortDirection === "asc") ? "desc" : "asc";
        } else {
            currentSortField = sortField;
            currentSortDirection = "asc";
        }

        fetchSortedData(currentSortField, currentSortDirection);
    });
});

function fetchSortedData(sortField, sortDirection) {
    $.ajax({
        url: "/expenses/sort",
        method: "POST",
        data: { 
            sortField: sortField,
            sortDirection: sortDirection
        },
        success: function(data) {
            let tableBody = '';
            data.forEach(expense => {
                const formattedDate = moment(expense.date).calendar(null, {
                    sameDay: '[Today at] h:mm A',
                    nextDay: '[Tomorrow at] h:mm A',
                    nextWeek: 'dddd [at] h:mm A',
                    lastDay: '[Yesterday at] h:mm A',
                    lastWeek: '[Last] dddd [at] h:mm A',
                    sameElse: 'DD/MM/YYYY [at] h:mm A'
                });
                
                const tagsHtml = expense.tags.map(tag => `<a href="/expenses/filterByTag/${tag._id}" class="badge bg-primary">${tag.name}</a>`).join('');

                tableBody += `
                <tr>
                    <td>${expense.amount}</td>
                    <td>${formattedDate}</td>
                    <td>${expense.category.name}</td>
                    <td>${expense.description}</td>
                    <td>${tagsHtml}</td>
                    <td>
                        <a href="/expenses/${expense._id}/edit" class="btn btn-info">Edit</a>
                        <form action="/expenses/${expense._id}/delete" method="POST" class="d-inline">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>
                `;
            });

            $('tbody').html(tableBody);
        },
        error: function(error) {
            console.error("Error fetching sorted data:", error);
        }
    });
}

