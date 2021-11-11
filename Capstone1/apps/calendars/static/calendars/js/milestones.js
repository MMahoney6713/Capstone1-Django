$(function () {

    // Helpful jQuery objects for later use
    const monthlyViewDiv = $('.month-views');
    const milestoneModal = $('#milestone-modal')

    const BASE_URL = 'http://127.0.0.1:8000';
    const csrftoken = Cookies.get('csrftoken');

    
    
    /////////////////////////////////////////////////////////////////////////////////////
    ///// Add event handlers for add/edit/delete milestone actions on the calendars /////
    /////////////////////////////////////////////////////////////////////////////////////

    monthlyViewDiv.on('click', 'td.milestone-space', async function (event) {
        target = $(event.target);
        if (target.is('td')) {
            const clickedCalendarCell = $(event.target).closest('td');
            tempMilestone = showTemporaryMilestone(clickedCalendarCell);
            setupAndShowModal(clickedCalendarCell, tempMilestone);
        } else if (target.is('a')) {
            if (target.hasClass('milestone-delete')) {
                milestoneID = target.parent().parent().data('id');
                await deleteMilestone(milestoneID);
                target.parent().parent().remove();
            }
            if (target.hasClass('milestone-update')) {
                console.log('hello');
            }
        }
        
    })

    function showTemporaryMilestone(calendarCell) {
        tempMilestone = Milestone.emptyMilestone();
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

                const response = await axios.post(`${BASE_URL}/calendars/milestones`, milestoneData, {headers: {'X-CSRFToken': csrftoken}});
                const newMilestone = new Milestone(response.data);
                
                tempMilestone.remove();
                calendarCell.append(newMilestone.HTML());

                milestoneModal.modal('hide');
                $('#milestone-title').val('');
                $('#milestone-goal').val('');
                $('.btn-milestone-create').off();
            } else {

            }
        })

        $('.btn-milestone-cancel').on('click', function() {
            milestoneModal.modal('hide');
            tempMilestone.remove();
        })
    }

    async function deleteMilestone(milestoneID) {
        const response = await axios.delete(`${BASE_URL}/calendars/milestones`, {data: {'milestone_id':milestoneID}, headers: {'X-CSRFToken': csrftoken}});
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
})