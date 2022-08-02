import data from '../mock-data.json';

const getData = async (): Promise<any> => {
    return new Promise((resolve) => {
        return setTimeout(() => resolve(data), 800);
    });
};

export { getData };