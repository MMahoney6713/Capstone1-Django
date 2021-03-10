$(function () {

    // Helpful jQuery objects for later use
    const monthlyViewDiv = $('.month-views');

    ////////////////////////////////////////////////////////////
    ///// Build the HTML for each of the monthly calendars /////
    ////////////////////////////////////////////////////////////

    function buildCalendars(monthTemp, yearTemp, today) {
        const monthsArray = ['January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Reset Month and Year using the input temporary variables in case of month value being < 0 or > 12
        month = new Date(yearTemp, monthTemp).getMonth();
        year = new Date(yearTemp, monthTemp).getFullYear();

        // Initiate a head and body for the calendar table
        const calendarHead = buildCalendarHead(monthsArray[month], year); 
        const calendarBody = $('<tbody>');

        // Determine number of calendar 'blocks' needed to build the month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const blocksNeeded = calendarBlocksNeeded(firstDayOfMonth, daysInMonth);

        addCalendarToDOM(firstDayOfMonth, daysInMonth, blocksNeeded, calendarBody, calendarHead, today);
    }

    function buildCalendarHead(months, year) {
        return $(`
        <table class="table table-bordered py-2 my-2" width="100%" cellspacing="0">
            <thead class="font-weight-bold">
                <tr>
                    <th class="text-center text-light bg-primary" colspan="7">${month} ${year}</th>
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

    function addCalendarToDOM(firstDayOfMonth, daysInMonth, blocksNeeded, calendarBody, calendarHead, today) {
        
        // Counters for making sure the calendar dates are lined up 
        let blockCount = 0;
        let dayCount = 1;
        const weekLength = 7;

        for (let j = 0; j < blocksNeeded / weekLength; j++) {
            const dayRow = $('<tr></tr>');
            const milestoneRow = $('<tr class="milestone-row">');

            for (let i = 0; i < weekLength; i++) {

                if (blockCount < firstDayOfMonth || dayCount > daysInMonth) {
                    dayRow.append($('<td class="table-secondary py-1"></td>'));
                    milestoneRow.append($('<td class="table-secondary p-1"></td>'));
                } else {
                    if (today.getDay() === dayCount && today.getMonth() === month) {
                        dayRow.append($(`<td class="table-warning py-1">${dayCount}</td>`));
                        milestoneRow.append($(`
                        <td class="table-warning milestone-space p-1" id="${year}-${month + 1}-${dayCount}"></td>`));
                    } else {
                        dayRow.append($(`<td class="py-1">${dayCount}</td>`));
                        milestoneRow.append($(`<td class="milestone-space p-1" id="${year}-${month + 1}-${dayCount}">`));
                    }
                    dayCount++;
                }
                blockCount++;
            }
            calendarBody.append(dayRow);
            calendarBody.append(milestoneRow);
        }
        calendarHead.append(calendarBody);
        monthlyViewDiv.append(calendarHead);
    }

    // Build the calendar HTML in the DOM
    const numberOfMonthsToShow = 3;
    for (let i = 0; i < numberOfMonthsToShow; i++) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        buildCalendars(currentMonth + i, currentYear, today);
    }






    
    //////////////////////////////////////////////////////////////////////////
    ///// Add event handlers for add/edit event actions on the calendars /////
    //////////////////////////////////////////////////////////////////////////
    
    monthlyViewDiv.on('click', 'td.milestone-space', function (event) {
        target = $(event.target);
        
        // Check if the modal is already open, or if event edit dropdown is open
        const modalIsOpen = $('.milestone-modal').length;
        const eventEditIsOpen = $('.dropdown-menu.show').length;

        if (target[0].nodeName === "A"){
            currentEvent = target.parent().parent();
            
            if (target.hasClass('milestone-delete')) {
                currentEvent.remove();
            } else if (target.hasClass('milestone-update')) {
                eventModal = createAndShowEventModal(currentEvent.parent(), method='patch');
                addModalListeners(milestone, eventModal);
            }

        } else if (modalIsOpen !== 0 || eventEditIsOpen !== 0 || target[0].nodeName === "BUTTON") {
            return; 

        } else {
            milestone = newMilestone(); 
            target.append(milestone);
            eventModal = createAndShowEventModal(target);
            addModalListeners(milestone, eventModal);
        }
    })

    function createAndShowEventModal (targetObj, method='post') {
            const [year, month, day] = targetObj.attr('id').split('-');
            modal = newModal(year, month, day, method);
            $('body').append(modal);
            modal.modal('show');
            return modal
    }

    function addModalListeners(milestoneObj, modalObj) {
        
        $('.btn-milestone-cancel').on('click', function() {
            modalObj.modal('hide');
        })

        $('.btn-milestone-create').on('click', function(event) {
            event.preventDefault();

            let formTitle = $('#new-milestone-title').val();
            if (formTitle === '') {
                formTitle = 'New Milestone';
            }
            milestoneObj.children('.event').html(formTitle);

            const formDate = $('#new-milestone-year').val() + '-' + $('#new-milestone-month').val() + '-' + $('#new-milestone-day').val();
            milestoneObj.detach().appendTo($(`#${formDate}`));

            if (milestoneObj.hasClass('created')) {

            } else {
                milestoneObj.toggleClass('created');
            }
            modalObj.modal('hide');
        })

        modalObj.on('hidden.bs.modal', function() {
            if (!milestoneObj.hasClass('created')) {
                milestoneObj.remove();
            }
            // CSS transition for modal fade gets in the way of the modal being removed, so wait for transition and then remove
            // setTimeout(()=>(modalObj.remove()),200);
            modalObj.remove();
        })
    }






    function newMilestone() {
        return $(`
        <div class="dropright">
            <button type="button" class="btn btn-secondary btn-block milestone p-0 my-1"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                New Milestone
            </button>
            <div class="dropdown-menu dropdown-menu-right shadow p-1 m-1 overflow"
                aria-labelledby="dropdown">
                <a class="dropdown-item milestone-update">
                    <i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-info"></i>
                    Update
                </a>
                <a class="dropdown-item milestone-delete">
                    <i class="fas fa-trash-alt fa-sm fa-fw mr-2 text-danger"></i>
                    Rubbish
                </a>
            </div>
        </div>
        `);
    }

    function newModal(year, month, day, method) {
        $modal = $(`
            <div class="modal fade milestone-modal ${method}" id="editMilestoneModal" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered edit-milestone-modal-content" role="document">
                    <div class="modal-content ">
                        <div class="modal-header">
                        <h5 class="modal-title" id="ModalLongTitle">Create/Edit Event</h5>
                        </div>
                        <div class="modal-body">
                            <form class="${method}" id="new-event-form" action="/milestones" method="${method}">

                                <div class="form-group row">
                                    <div class="col-sm-4">
                                        <label for="new-milestone-month" class="col-sm col-form-label">Month:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-milestone-month"
                                                value="${month}">
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <label for="new-milestone-day" class="col-sm col-form-label">Day:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-milestone-day"
                                                value="${day}">
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <label for="new-milestone-year" class="col-sm col-form-label">Year:</label>
                                        <div class="col-sm mb-6 mb-sm-0">
                                            <input type="text" class="form-control form-control-user" id="new-milestone-year"
                                                value="${year}">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row px-3">
                                    <label for="new-milestone-title" class="col-sm-3 col-form-label">Title:</label>
                                    <div class="col-sm-8 mb-6 mb-sm-0">
                                        <input type="text" class="form-control form-control-user" id="new-milestone-title"
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
                            <button type="button" class="btn btn-danger btn-milestone-cancel" data-dismiss="modal">Cancel</button>
                            <button form="new-event-form" type="button" class="btn btn-success btn-milestone-create">Save Event</button>
                        </div>
                    </div>
                </div>
            </div>
            `);
        return $modal;
    }

})