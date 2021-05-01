$(function() {

    const missionsList = $('#missions-list');
    const missionsBtn = $('#missions-btn');
    const missionSubmitBtn = $('.btn-mission-create');
    const missionModal = $('#mission-modal');

    async function getMissions() {
        await Mission.getAll()
    }
    getMissions()
    



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

    // missionsList.on('mouseover', 'li', function(event) {
    //     $(event.target).append('<i class="fas fa-trash-alt btn-mission-delete"></i>')
    // })
    // missionsList.on('mouseout', 'li', function(event) {
    //     $(event.target).children().remove()
    // })

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