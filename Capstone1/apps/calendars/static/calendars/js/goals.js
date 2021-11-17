$(async function() {

    const goalsList = $('#goals-list');
    const goalsBtn = $('#goals-btn');
    // const goalSubmitBtn = $('.btn-goal-create');
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
        addListenersToGoalModal({}, 'post')
    })

    goalsList.on('click','.btn-goal-update', async function(event) {
        let goalObj = $(event.target).parent().parent().parent();
        if (event.target.nodeName === "path") {
            goalObj = goalObj.parent();
        }

        const goal = await Goal.getOne(goalObj.data('id'))
        setupAndShowGoalModal(goal, goalObj, 'put')
    })

    function setupAndShowGoalModal(goal, goalObj, requestType) {
        goalModal.modal('show')
        $('#goal-title').val(goal.title);
        $('#goal-description').val(goal.description);
        addListenersToGoalModal(goalObj, requestType);
    }

    function addListenersToGoalModal(goalObj, requestType) {
        
        $('.btn-goal-create').on('click', async function(event) {
            event.preventDefault();

            const goalData = retreiveGoalDataFromModal()
            const errors = validateGoalInputs(goalData);
            if (errors.length === 0) {

                if (requestType === "post") {
                    const newGoal = await Goal.post(goalData)
                    goalsList.append(newGoal.HTML())
                } else if (requestType === "put") {
                    goalData['id'] = goalObj.data('id');
                    const updatedGoal = await Goal.put(goalData);
                    goalObj.find('.goal-title').text(updatedGoal.title);
                    goalObj.find('.goal-description').text(updatedGoal.description);
                }
            } 

            goalModal.modal('hide');
            $('#goal-title').val('');
            $('#goal-goal').val('');
            $('.btn-goal-create').off();
        })

        $('.btn-milestone-cancel').on('click', function() {
            milestoneModal.modal('hide');
        })
    }

    goalsList.on('click','.btn-goal-delete', async function(event) {
        let goal = $(event.target).parent().parent().parent();
        if (event.target.nodeName === "path") {
            goal = goal.parent();
        }
        
        const response = await Goal.delete(goal.data('id'));
        goal.remove();
    })

    function validateGoalInputs(goalInputs) {
        return [];
    }

    function retreiveGoalDataFromModal() {
        return {
            'title': $('#goal-title').val(),
            'description': $('#goal-description').val()
        }
    }



    // goalsBtn.on('click', function () {
    //     goalModal.modal('show');
    // })

    // goalSubmitBtn.on('click', async function(event) {
    //     event.preventDefault();

    //     goalData = {
    //         'title': $('#goal-title').val(),
    //         'description': $('#goal-description').val()
    //     }

    //     const errors = validateGoalInputs(goalData);
    //     if (errors.length === 0) {

    //         const newGoal = await Goal.post(goalData)
    //         goalsList.append(newGoal.HTML())

    //         goalModal.modal('hide');
    //         $('#goal-title').val('');
    //         $('#goal-description').val('');
    //     } else {

    //     }
    // })

    // goalsList.on('click','.btn-goal-delete', async function(event) {
    //     let goal = $(event.target).parent().parent().parent();
    //     if (event.target.nodeName === "path") {
    //         goal = goal.parent();
    //     }
        
    //     const response = await Goal.delete(goal.data('id'));
    //     goal.remove();
    // })
    

    // function validateGoalInputs(goalInputs) {
    //     return [];
    // }

    // function retreiveGoalDataFromModal() {
    //     return {
    //         'year': $('#goal-year').val(),
    //         'month': $('#goal-month').val(),
    //         'day': $('#goal-day').val(),
    //         'title': $('#goal-title').val(),
    //         'goal_id': $('#goal-goal').val(),
    //     }
    // }


})