$(async function() {

    const goalsList = $('#goals-list');
    const goalsBtn = $('#goals-btn');
    const goalSubmitBtn = $('.btn-goal-create');
    const goalModal = $('#goal-modal');

    async function getGoals() {
        const goals = await Goal.getAll()
        for (const goalHTML of goals) {
            goalsList.append(goalHTML)
        }
    }
    await getGoals()
    



    ////////////////////////////////////////////////////////////
    ///// Build the HTML for each of the user goals     /////
    ////////////////////////////////////////////////////////////
    

    goalsBtn.on('click', function () {
        goalModal.modal('show');
    })

    goalSubmitBtn.on('click', async function(event) {
        event.preventDefault();

        goalData = {
            'title': $('#goal-title').val(),
            'description': $('#goal-description').val()
        }

        const errors = validateGoalInputs(goalData);
        if (errors.length === 0) {

            const newGoal = await Goal.post(goalData)
            goalsList.append(newGoal.HTML())

            goalModal.modal('hide');
            $('#goal-title').val('');
            $('#goal-description').val('');
        } else {

        }
    })

    goalsList.on('click','.btn-goal-delete', async function(event) {
        const goal = $(event.target).parent().parent().parent();
        const response = await Goal.delete(goal.data('id'))
        goal.remove();
    })
    

    function validateGoalInputs(goalInputs) {
        return [];
    }

    function retreiveGoalDataFromModal() {
        return {
            'year': $('#goal-year').val(),
            'month': $('#goal-month').val(),
            'day': $('#goal-day').val(),
            'title': $('#goal-title').val(),
            'goal_id': $('#goal-goal').val(),
        }
    }


})