
const BASE_URL = 'http://127.0.0.1:8000'
const csrftoken = Cookies.get('csrftoken');

class Milestone {
    constructor(milestoneObj) {
        this.id = milestoneObj.id;
        this.year = milestoneObj.year;
        this.month = milestoneObj.month;
        this.day = milestoneObj.day;
        this.title = milestoneObj.title;
        this.goalID = milestoneObj.goal_id;
    }


    HTML() {
        return $(`
        <div class="dropright" data-id="${this.id}" data-goalID="${this.goalID}">
            <button type="button" class="btn btn-secondary btn-block milestone p-0 my-1"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                ${this.title}
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

    static emptyMilestone() {
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
}

class Calendar {
    constructor(milestoneObj) {
        this.id = milestoneObj.id;
        this.year = milestoneObj.year;
        this.month = milestoneObj.month;
        this.day = milestoneObj.day;
        this.title = milestoneObj.title;
        this.goalID = milestoneObj.goal_id;
    }

}


class Mission {

    static missionsUrl = 'calendars/missions';

    constructor(missionObj) {
        this.id = missionObj.id;
        this.title = missionObj.title;
        this.description = missionObj.description;
    }


    HTML() {
        return $(`
        <div class="card mb-2 mission-div" data-id="${this.id}">
            <div class="card-header py-2 bg-secondary d-flex justify-content-between">
                <h6 class="m-1 font-weight-bold text-light mission-title">${this.title}</h6>
                <div class="m-0 p-0">
                    <svg class="btn-mission-update" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                    </svg>
                    <svg class="btn-mission-delete" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="white" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </div>
            </div>
            <div class="card-body">
                <div class="mission-description">${this.description}</div>
            </div>
        </div>
        `);
    }

    static async post(missionData) {
        const response = await axios.post(`${BASE_URL}/${Mission.missionsUrl}/`, missionData, { headers: { 'X-CSRFToken': csrftoken } });
        return new Mission(response.data);
    }

    static async put(missionData) {
        const response = await axios.put(`${BASE_URL}/${Mission.missionsUrl}/`, missionData, {headers: {'X-CSRFToken': csrftoken}});
        return new Mission(response.data);
    }

    static async getOne(missionID) {
        const response = await axios.get(`${BASE_URL}/${Mission.missionsUrl}/${missionID}`, { headers: { 'X-CSRFToken': csrftoken } });
        return new Mission(response.data[0]);
    }

    static async getAll() {
        const response = await axios.get(`${BASE_URL}/${Mission.missionsUrl}`);
        const missionList = Array(response.data.length);
        for (let i = 0; i < missionList.length; i++) {
            const missionData = response.data[i];
            const mission = new Mission({ 'id': missionData.id, 'title': missionData.title, 'description': missionData.description });
            missionList[i] = mission.HTML();
        }
        return missionList;
    }

    static async delete(missionID) {
        const response = await axios.delete(`${BASE_URL}/${Mission.missionsUrl}`, { data: { 'mission_id': missionID }, headers: { 'X-CSRFToken': csrftoken } });
        return response;
    }
}


class Goal {

    static goalsUrl = 'calendars/goals';

    constructor(goalObj) {
        this.id = goalObj.id;
        this.title = goalObj.title;
        this.description = goalObj.description;
    }


    HTML() {
        return $(`
        <div class="card mb-2 goal-div" data-id="${this.id}">
            <div class="card-header py-2 bg-secondary d-flex justify-content-between">
                <h6 class="m-1 font-weight-bold text-light goal-title">${this.title}</h6>
                <div class="m-0 p-0">
                    <svg class="btn-goal-update" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                    </svg>
                    <svg class="btn-goal-delete" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="white" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </div>
            </div>
            <div class="card-body">
                <div class="goal-description">${this.description}</div>
            </div>
        </div>
        `);
    }



    static async post(goalData) {
        const response = await axios.post(`${BASE_URL}/${Goal.goalsUrl}/`, goalData, { headers: { 'X-CSRFToken': csrftoken } });
        return new Goal(response.data);
    }

    static async put(goalData) {
        const response = await axios.put(`${BASE_URL}/${Goal.goalsUrl}/`, goalData, {headers: {'X-CSRFToken': csrftoken}});
        return new Goal(response.data);
    }

    static async getOne(goalID) {
        const response = await axios.get(`${BASE_URL}/${Goal.goalsUrl}/${goalID}`, { headers: { 'X-CSRFToken': csrftoken } });
        return new Goal(response.data[0]);
    }

    static async getAll() {
        const response = await axios.get(`${BASE_URL}/${Goal.goalsUrl}`);
        const goalList = Array(response.data.length);
        for (let i = 0; i < goalList.length; i++) {
            const goalData = response.data[i];
            const goal = new Goal({ 'id': goalData.id, 'title': goalData.title, 'description': goalData.description });
            goalList[i] = goal.HTML();
        }
        return goalList;
    }

    static async delete(goalID) {
        const response = await axios.delete(`${BASE_URL}/${Goal.goalsUrl}`, { data: { 'goal_id': goalID }, headers: { 'X-CSRFToken': csrftoken } });
        return response;
    }
}