export default {
    namespace: "Global",
    state: {
        halfCheckedKeys: [],
        defaultCheckedKeys: [],
    },
    effects: {
        // * getList(_: any, {call, put}: any): any {
        //   const res = yield call(getPageList)
        //   yield put({
        //     type: "save",
        //     payload: {
        //       data: res.data.rows
        //     }
        //   })
        // }
    },
    reducers: {
        save(state: any, action: any) {
            return {...state, ...action.payload}
        }
    }
}
