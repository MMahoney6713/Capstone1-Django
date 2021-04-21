$(function() {

    const missionsList = $('#missions-list');
    const missionsBtn = $('#missions-btn');
    const missionSubmitBtn = $('.btn-mission-create');
    const missionModal = $('#mission-modal');

    missionsBtn.on('click', function () {
        missionModal.modal('show');
    })

    missionSubmitBtn.on('click', function(event) {
        event.preventDefault();

        // const missionData = retreiveMissionDataFromModal()
        // const errors = validateMissionInputs(missionData);
        // if (errors.length === 0) {

        //     const response = await axios.post(`${BASE_URL}/calendars/missions`, missionData, {headers: {'X-CSRFToken': csrftoken}});
        //     const newMission = new Mission(response.data);
            
        //     tempMission.remove();
        //     calendarCell.append(newMission.HTML());

        //     missionModal.modal('hide');
        //     $('#mission-title').val('');
        //     $('#mission-goal').val('');
        //     $('.btn-mission-create').off();
        // } else {

        // }
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