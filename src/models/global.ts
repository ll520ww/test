import {deleteUser} from "@/services/demo/UserController";


export default {
    namespace: "Global",
    state: {
        name: "",
        phone: 0,
        data: []
    },
    effects: {
        * getList(_: any, {call, put}: any): any {
            const res = yield call(deleteUser)
            yield put({
                type: "save",
                payload: {
                    data: res.data.rows
                }
            })
        }
    },
    reducers: {
        save(state: any, action: any) {
            return {...state, ...action.payload}
        }
    }
}
