
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
        this.month = missionObj.month;
    }
    

    HTML() {
        return $(`<li data-id="${this.id}">${this.title}<i class="fas fa-trash-alt btn-mission-delete"></i></li>`);
    }

    static async post(missionData) {
        const response = await axios.post(`${BASE_URL}/${Mission.missionsUrl}`, missionData, {headers: {'X-CSRFToken': csrftoken}});
        return new Mission(response.data)
    }

    static async getAll() {
        const response = await axios.get(`${BASE_URL}/${Mission.missionsUrl}`);
        console.log(response)
        // missionList = Array(response.data.length)
        // for (let i = 0; i < missionList.length; i++) {
        //     missionList[i] = response.data
        // }
    }

    async delete() {
        const response = await axios.delete(`${BASE_URL}/${Mission.missionsUrl}/${this.id}`)
    }
}