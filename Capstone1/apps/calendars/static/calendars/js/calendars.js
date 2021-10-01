$(function () {

    // Helpful jQuery objects for later use
    const monthlyViewDiv = $('.month-views');
    const milestoneModal = $('#milestone-modal')

    const BASE_URL = 'http://127.0.0.1:8000';
    const csrftoken = Cookies.get('csrftoken');

    const monthsArray = ['January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    ////////////////////////////////////////////////////////////
    ///// Build the HTML for each of the monthly calendars /////
    ////////////////////////////////////////////////////////////

    async function setupCalendar(monthTemp, yearTemp, today) {
        
        // Reset Month and Year using the input temporary variables in case of month value being < 0 or > 12
        month = new Date(yearTemp, monthTemp).getMonth();
        year = new Date(yearTemp, monthTemp).getFullYear();

        // Get the milestone data from server
        const milestonesThisMonth = await axios.get(`${BASE_URL}/calendars/milestones`, {params: {'month':month, 'year':year}}, {headers: {'X-CSRFToken': csrftoken}});
        
        // Initiate a head and body for the calendar table
        const calendarHead = buildCalendarHead(monthsArray[month], year); 
        const calendarBody = $('<tbody>');

        // Determine number of calendar 'blocks' needed to build the month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const blocksNeeded = calendarBlocksNeeded(firstDayOfMonth, daysInMonth);

        addCalendarToDOM(firstDayOfMonth, daysInMonth, blocksNeeded, calendarBody, calendarHead, today, milestonesThisMonth);
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

    function addCalendarToDOM(firstDayOfMonth, daysInMonth, blocksNeeded, calendarBody, calendarHead, today, milestonesThisMonth) {
        
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
                    if (today.getDate() === dayCount && today.getMonth() === month) {
                        dayRow.append($(`<td class="table-warning py-1">${dayCount}</td>`));
                        milestoneRow.append($(`
                        <td class="table-warning milestone-space p-1" id="${year}-${month + 1}-${dayCount}"></td>`));
                    } else {
                        dayRow.append($(`<td class="py-1">${dayCount}</td>`));
                        milestoneRow.append($(`<td class="milestone-space p-1" id="${year}-${month + 1}-${dayCount}">`));
                    }
                    
                    // Temporary for adding milestones
                    for (let k = 0; k < milestonesThisMonth.data.length; k++) {
                        if (Object.keys(milestonesThisMonth.data[k]).includes(`${dayCount}`)) {
                            const newMilestone = new Milestone(Object.values(milestonesThisMonth.data[k])[0]);
                            milestoneRow.children().last().append(newMilestone.HTML());
                        }
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
    // async function buildCalendars(numberOfMonthsToShow) {
    //     numberOfMonthsToShow = 2;
    //     for (let i = 0; i < numberOfMonthsToShow; i++) {
    //         const today = new Date();
    //         const currentMonth = today.getMonth();
    //         const currentYear = today.getFullYear();
            
    //         await setupCalendar(currentMonth + i, currentYear, today);
    //     }
    // }
    // buildCalendars(numberOfMonthsToShow);


    async function buildCalendars(numberOfMonthsToShow, startingMonth, startingYear, today) {
        for (let i = 0; i < numberOfMonthsToShow; i++) {
            await setupCalendar(startingMonth + i, startingYear, today);
        }
    }
    const today = new Date();
    let startingMonth = today.getMonth();
    let startingYear = today.getFullYear();
    numberOfMonthsToShow = 2;
    buildCalendars(numberOfMonthsToShow, startingMonth, startingYear, today);




    ////////////////////////////////////////////////////////////
    ///// Event Handlers for forward/backward on calendars /////
    ////////////////////////////////////////////////////////////

    $('.bi-arrow-left-circle-fill').on('click', async function(event) {
        monthlyViewDiv.empty();
        if (startingMonth <= numberOfMonthsToShow) {
            startingMonth -= monthsArray.length + startingMonth - numberOfMonthsToShow;
            startingYear -= 1;
        } else {
            startingMonth -= numberOfMonthsToShow;
        }
        buildCalendars(numberOfMonthsToShow, startingMonth, startingYear, today)
    })

    $('.bi-arrow-right-circle-fill').on('click', async function(event) {
        monthlyViewDiv.empty();
        if (startingMonth >= monthsArray.length - numberOfMonthsToShow) {
            startingMonth = -monthsArray.length + startingMonth - numberOfMonthsToShow;
            startingYear += 1;
        } else {
            startingMonth += numberOfMonthsToShow;
        }
        buildCalendars(numberOfMonthsToShow, startingMonth, startingYear, today)
    })



    
    
})