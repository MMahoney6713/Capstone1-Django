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

            const newMission = await Mission.post(missionData)
            missionsList.append(newMission.HTML())

            missionModal.modal('hide');
            $('#mission-title').val('');
            $('#mission-description').val('');
        } else {

        }
    })


    missionsList.on('click','.btn-mission-update', async function(event) {
        let missionObj = $(event.target).parent().parent().parent();
        if (event.target.nodeName === "path") {
            missionObj = missionObj.parent();
        }

        const mission = new Mission({ 
            'id': missionObj.data('id'), 
            'title': missionObj.first().text(), 
            'description': missionObj.last().text()})
        setupAndShowMissionModal(mission, 'post')
    })

    function setupAndShowMissionModal(mission, requestType) {
        missionModal.modal('show')
        addListenersToMissionModal(mission, requestType);
    }

    function addListenersToMissionModal(mission, requestType) {
        
        
    }

    missionsList.on('click','.btn-mission-delete', async function(event) {
        let mission = $(event.target).parent().parent().parent();
        if (event.target.nodeName === "path") {
            mission = mission.parent();
        }
        
        const response = await Mission.delete(mission.data('id'));
        mission.remove();
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