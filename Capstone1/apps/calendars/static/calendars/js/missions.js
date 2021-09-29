$(async function() {

    const missionsList = $('#missions-list');
    const missionsBtn = $('#missions-btn');
    const missionSubmitBtn = $('.btn-mission-create');
    const missionModal = $('#mission-modal');

    async function getMissions() {
        const missions = await Mission.getAll()
        for (const missionHTML of missions) {
            missionsList.append(missionHTML)
        }
    }
    await getMissions()
    



    ////////////////////////////////////////////////////////////
    ///// Build the HTML for each of the user missions     /////
    ////////////////////////////////////////////////////////////
    

    missionsBtn.on('click', function () {
        missionModal.modal('show');
    })

    missionSubmitBtn.on('click', async function(event) {
        event.preventDefault();

        missionData = {
            'title': $('#mission-title').val(),
            'description': $('#mission-description').val()
        }

        const errors = validateMissionInputs(missionData);
        if (errors.length === 0) {

            // const response = await axios.post(`${BASE_URL}/calendars/missions`, missionData, {headers: {'X-CSRFToken': csrftoken}});
            // const newMission = new Mission(response.data);
            const newMission = await Mission.post(missionData)
            
            missionsList.append(newMission.HTML())

            missionModal.modal('hide');
            $('#mission-title').val('');
            $('#mission-description').val('');
        } else {

        }
    })

    missionsList.on('click','.btn-mission-delete', function(event) {
        $(event.target).parent().remove();        
    })

    missionsList.on('mouseenter', 'li', function(event) {
        deleteBtn = $(event.target).find('i');
        if (deleteBtn.hasClass('hidden')) {
            deleteBtn.toggle('hidden')
        }
    })
    missionsList.on('mouseleave', 'li', function(event) {
        target = $(event.target);
        if (target.is('i')) {
            target.toggle('hidden');
        } else {
            target.children('i').toggle('hidden');
        }
        
    })

    function validateMissionInputs(missionInputs) {
        return [];
    }

    function retreiveMissionDataFromModal() {
        return {
            'year': $('#mission-year').val(),
            'month': $('#mission-month').val(),
            'day': $('#mission-day').val(),
            'title': $('#mission-title').val(),
            'goal_id': $('#mission-goal').val(),
        }
    }


})