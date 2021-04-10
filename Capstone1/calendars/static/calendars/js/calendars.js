$(function () {

    // Helpful jQuery objects for later use
    const monthlyViewDiv = $('.month-views');
    const milestoneModal = $('#milestone-modal')

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

    function buildCalendarHead(month, year) {
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
    
    // monthlyViewDiv.on('click', 'td.milestone-space', function (event) {
    //     target = $(event.target);
        
    //     // Check if the modal is already open, or if event edit dropdown is open
    //     const modalIsOpen = $('.milestone-modal').length;
    //     const eventEditIsOpen = $('.dropdown-menu.show').length;

    //     if (target[0].nodeName === "A"){
    //         currentEvent = target.parent().parent();
            
    //         if (target.hasClass('milestone-delete')) {
    //             currentEvent.remove();
    //         } else if (target.hasClass('milestone-update')) {
    //             eventModal = createAndShowEventModal(currentEvent.parent(), method='patch');
    //             addModalListeners(milestone, eventModal);
    //         }

    //     } else if (modalIsOpen !== 0 || eventEditIsOpen !== 0 || target[0].nodeName === "BUTTON") {
    //         return; 

    //     } else {
    //         milestone = newMilestone(); 
    //         target.append(milestone);
    //         eventModal = createAndShowEventModal(target);
    //         addModalListeners(milestone, eventModal);
    //     }
    // })

    monthlyViewDiv.on('click', 'td.milestone-space', async function (event) {
        const clickedCalendarCell = $(event.target).closest('td');
        tempMilestone = showTemporaryMilestone(clickedCalendarCell);
        setupAndShowModal(clickedCalendarCell, tempMilestone);
        
        // const response = await axios.post('http://127.0.0.1:8000/milestones', {'title':'title', 'date':'date'});
        // console.log(response);
    })

    function showTemporaryMilestone(calendarCell) {
        tempMilestone = newMilestone();
        calendarCell.append(tempMilestone);
        return tempMilestone;
    }

    function setupAndShowModal(calendarCell, tempMilestone) {
        milestoneModal.modal('show')
        const [year, month, day] = calendarCell.attr('id').split('-'); 
        $('#milestone-year').val(year)
        $('#milestone-month').val(month)
        $('#milestone-day').val(day)
        addModalListeners(milestoneModal, calendarCell, tempMilestone)
    }

    function addModalListeners(milestoneModal, calendarCell, tempMilestone) {
        
        $('.btn-milestone-create').on('click', async function(event) {
            event.preventDefault();

            const milestoneData = retreiveMilestoneDataFromModal()
            const errors = validateMilestoneInputs(milestoneData);
            if (errors.length === 0) {

                const response = await axios.post('http://127.0.0.1:8000/milestones', milestoneData);
                const newMilestone = new Milestone(response.data);
                
                tempMilestone.remove();
                calendarCell.append(newMilestone.HTML());

                milestoneModal.modal('hide');
                $('#milestone-title').val('');
                $('#milestone-goal').val('');

            } else {

            }


            // const response = await axios.post('http://127.0.0.1:8000/milestones?ID=12345', {'title':'title', 'date':'date'})
            // console.log(response)

            // let formTitle = $('#new-milestone-title').val();
            // if (formTitle === '') {
            //     formTitle = 'New Milestone';
            // }
            // milestoneObj.children('.event').html(formTitle);

            // const formDate = $('#new-milestone-year').val() + '-' + $('#new-milestone-month').val() + '-' + $('#new-milestone-day').val();
            // milestoneObj.detach().appendTo($(`#${formDate}`));

            // if (!milestoneObj.hasClass('created')) {
            //     milestoneObj.toggleClass('created');
            // }
            // modalObj.modal('hide');
        })

        $('.btn-milestone-cancel').on('click', function() {
            milestoneModal.modal('hide');
            tempMilestone.remove();
        })

        // modalObj.on('hidden.bs.modal', function() {
        //     if (!milestoneObj.hasClass('created')) {
        //         milestoneObj.remove();
        //     }
        //     modalObj.remove();
        // })
    }

    function validateMilestoneInputs(milestoneInputs) {
        return [];
    }

    function retreiveMilestoneDataFromModal() {
        return {
            'year': $('#milestone-year').val(),
            'month': $('#milestone-month').val(),
            'day': $('#milestone-day').val(),
            'title': $('#milestone-title').val(),
            'goal_id': $('#milestone-goal').val(),
        }
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
})