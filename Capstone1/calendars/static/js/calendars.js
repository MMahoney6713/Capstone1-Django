$(function () {

    // Helpful jQuery objects for later use
    const $monthlyViewDiv = $('.month-views');


    ///// Build the HTML for each of the monthly calendars /////

    function buildCalendarHTML(monthTemp, yearTemp, today) {
        const weekdayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsArray = ['January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Reset Month and Year using the input temporary variables in case of month being < 0 or > 12
        month = new Date(yearTemp, monthTemp).getMonth();
        year = new Date(yearTemp, monthTemp).getFullYear();

        // Build header
        const $calendarHead = $(`
        <table class="table table-bordered py-2 my-2" width="100%" cellspacing="0">
            <thead class="font-weight-bold">
                <tr>
                    <th class="text-center text-light bg-primary" colspan="7">${monthsArray[month]} ${year}</th>
                </tr>
                <tr class="table-primary text-light">
                    <th class="calendar-col">Sun.</th>
                    <th class="calendar-col">Mon.</th>
                    <th class="calendar-col">Tues.</th>
                    <th class="calendar-col">Wed.</th>
                    <th class="calendar-col">Thur.</th>
                    <th class="calendar-col">Fri.</th>
                    <th class="calendar-col">Sat.</th>
                </tr>
            </thead>
        </table>
        `);

        // Body to be appended to 
        const $calendarBody = $('<tbody>');

        // Determine number of calendar 'cells' needed to build the month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const blocks_needed = calendarBlocksNeeded(firstDayOfMonth, daysInMonth);

        let block_count = 0;
        let day_count = 1;
        for (let j = 0; j < blocks_needed / weekdayArray.length; j++) {
            const $dayCountRow = $('<tr></tr>');
            const $eventRow = $('<tr class="event-row">');

            for (let i = 0; i < weekdayArray.length; i++) {

                if (block_count < firstDayOfMonth || day_count > daysInMonth) {
                    $dayCountRow.append($('<td class="table-secondary py-1"></td>'));
                    $eventRow.append($('<td class="table-secondary p-1"></td>'));
                } else {
                    if (today.getDay() === day_count && today.getMonth() === month) {
                        $dayCountRow.append($(`<td class="table-warning py-1">${day_count}</td>`));
                        $eventRow.append($(`
                        <td class="table-warning event-space p-1" id="${year}-${month + 1}-${day_count}"></td>`));
                    } else {
                        $dayCountRow.append($(`<td class="py-1">${day_count}</td>`));
                        $eventRow.append($(`<td class="event-space p-1" id="${year}-${month + 1}-${day_count}">`));
                    }
                    day_count++;
                }
                block_count++;
            }
            $calendarBody.append($dayCountRow);
            $calendarBody.append($eventRow);
        }
        $calendarHead.append($calendarBody);
        $monthlyViewDiv.append($calendarHead);
    }

    function calendarBlocksNeeded(firstDayOfMonth, daysInMonth) {
        // Sum the number of blanks to the first day, plus days in month, plus blanks to end of calendar
        const numDaysInWeek = 7;
        const numberBlankCellsToFirstDay = firstDayOfMonth;
        
        let numberBlanksAtEnd = 0;
        if ((numberBlankCellsToFirstDay + daysInMonth) % numDaysInWeek !== 0) {
            numberBlanksAtEnd = numDaysInWeek - (numberBlankCellsToFirstDay + daysInMonth) % numDaysInWeek;
        }

        return numberBlankCellsToFirstDay + numberBlanksAtEnd + daysInMonth;
    }

    const numberOfMonthsToShow = 3;
    for (let i = 0; i < numberOfMonthsToShow; i++) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        buildCalendarHTML(currentMonth + i, currentYear, today);
    }

    

    ///// Add event handlers for add/edit event actions on the calendars /////
    
    $monthlyViewDiv.on('click', 'td.event-space', function (event) {

        $target = $(event.target);
        
        // Check if the modal is already open, or if event edit dropdown is open
        const modalIsOpen = $('#editEventModal').length;
        const eventEditIsOpen = $('.dropdown-menu.show').length;

        if ($target[0].nodeName === "A"){
            $currentEvent = $target.parent().parent();
            
            if ($target.hasClass('event-delete')) {
                $currentEvent.remove();
            } else if ($target.hasClass('event-update')) {
                createAndShowEventModal($currentEvent.parent(), $currentEvent);
            }

        } else if (modalIsOpen !== 0 || eventEditIsOpen !== 0) {
            return; 

        } else if ($target[0].nodeName === "BUTTON") {
            return;

        } else {
            $newEvent = $(`
            <div class="dropright">
                <button type="button" class="btn btn-secondary btn-block event p-0 my-1"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    New Event
                </button>
                <div class="dropdown-menu dropdown-menu-right shadow p-1 m-1 overflow"
                    aria-labelledby="dropdown">
                    <a class="dropdown-item event-update">
                        <i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-info"></i>
                        Update
                    </a>
                    <a class="dropdown-item event-delete">
                        <i class="fas fa-trash-alt fa-sm fa-fw mr-2 text-danger"></i>
                        Rubbish
                    </a>
                </div>
            </div>
            `);

            $target.append($newEvent);
            createAndShowEventModal($target, $newEvent);
        }
    })

    function createAndShowEventModal (targetObj, eventObj) {
            const [year, month, day] = targetObj.attr('id').split('-');
            $editEventModal = newModal(year, month, day);
            $('body').append($editEventModal);
            $editEventModal.modal('show');
            addModalListeners(eventObj, $editEventModal);
    }

    function addModalListeners(eventObj, modalObj) {
        $('.btn-event-cancel').on('click', function() {
            modalObj.on('hidden.bs.modal', function() {
                eventObj.remove();
                modalObj.remove();
            })
        })

        modalObj.on('hidden.bs.modal', function() {
            eventObj.remove();
            modalObj.remove();
        })

        $('.btn-event-create').on('click', function(event) {
            event.preventDefault();

            let formTitle = $('#new-event-title').val();
            if (formTitle === '') {
                formTitle = 'New Event';
            }
            eventObj.children('.event').html(formTitle);

            const formDate = $('#new-event-year').val() + '-' + $('#new-event-month').val() + '-' + $('#new-event-day').val();
            eventObj.detach().appendTo($(`#${formDate}`));
            modalObj.modal('hide');
            setTimeout(()=>(modalObj.remove()),200);
        })
    }

    function newModal(year, month, day) {
        $modal = $(`
            <div class="modal fade" id="editEventModal" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered edit-event-modal-content" role="document">
                    <div class="modal-content ">
                        <div class="modal-header">
                        <h5 class="modal-title" id="ModalLongTitle">Create Event</h5>
                        </div>
                        <div class="modal-body">
                            <form class="" id="new-event-form">

                                <div class="form-group row">
                                    <div class="col-sm-4">
                                        <label for="new-event-month" class="col-sm col-form-label">Month:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-event-month"
                                                value="${month}">
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <label for="new-event-day" class="col-sm col-form-label">Day:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-event-day"
                                                value="${day}">
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <label for="new-event-year" class="col-sm col-form-label">Year:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-event-year"
                                                value="${year}">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row px-3">
                                    <label for="new-event-title" class="col-sm-3 col-form-label">Title:</label>
                                    <div class="col-sm-8 mb-6 mb-sm-0">
                                        <input type="text" class="form-control form-control-user" id="new-event-title"
                                            placeholder="Title">
                                    </div>
                                </div>

                                <div class="form-group row px-3">
                                    <label for="new-event-goal" class="col-sm-3 col-form-label">Goal:</label>
                                    <div class="col-sm-8 mb-6 mb-sm-0">
                                        <input type="text" class="form-control form-control-user" id="new-event-goal"
                                            placeholder="Goal">
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger btn-event-cancel" data-dismiss="modal">Cancel</button>
                            <button form="new-event-form" type="button" class="btn btn-success btn-event-create">Save Event</button>
                        </div>
                    </div>
                </div>
            </div>
            `);
        return $modal;
    }

})