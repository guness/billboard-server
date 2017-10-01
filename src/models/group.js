import groups from '../constants/mock/group';

export default {
    namespace: 'groupModel',
    state: {
        groups,
    },
    reducers: {
        addGroup(state, {payload: group}){
            const newGroup = {...group, id: Math.round(Math.random()*9999999)};
            return {
                ...state,
                groups: [...state.groups, newGroup],
            };
        },
        delete(state, {payload: {groupId}}){
            return {
                ...state,
                groups: state.groups.filter(group => group.id !== groupId),
            };
        }
    },
};