$(async function() {

    const missionsList = $('#missions-list');
    const missionsBtn = $('#missions-btn');
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
        addListenersToMissionModal({}, 'post')
    })

    missionsList.on('click','.btn-mission-update', async function(event) {
        let missionObj = $(event.target).parent().parent().parent();
        if (event.target.nodeName === "path") {
            missionObj = missionObj.parent();
        }

        const mission = await Mission.getOne(missionObj.data('id'))
        setupAndShowMissionModal(mission, missionObj, 'put')
    })

    function setupAndShowMissionModal(mission, missionObj, requestType) {
        missionModal.modal('show')
        $('#mission-title').val(mission.title);
        $('#mission-description').val(mission.description);
        addListenersToMissionModal(missionObj, requestType);
    }

    function addListenersToMissionModal(missionObj, requestType) {
        
        $('.btn-mission-create').on('click', async function(event) {
            event.preventDefault();

            const missionData = retreiveMissionDataFromModal()
            const errors = validateMissionInputs(missionData);
            if (errors.length === 0) {

                if (requestType === "post") {
                    const newMission = await Mission.post(missionData)
                    missionsList.append(newMission.HTML())
                } else if (requestType === "put") {
                    missionData['id'] = missionObj.data('id');
                    const updatedMission = await Mission.put(missionData);
                    missionObj.find('.mission-title').text(updatedMission.title);
                    missionObj.find('.mission-description').text(updatedMission.description);
                }
            } 

            missionModal.modal('hide');
            $('#mission-title').val('');
            $('#mission-goal').val('');
            $('.btn-mission-create').off();
        })

        $('.btn-milestone-cancel').on('click', function() {
            milestoneModal.modal('hide');
        })
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
            'title': $('#mission-title').val(),
            'description': $('#mission-description').val()
        }
    }

})