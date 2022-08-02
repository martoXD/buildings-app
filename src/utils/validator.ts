const validateField = async (validationSchema: any, objectData: object, fieldName: any): Promise<[boolean,string]> => {
    return new Promise((resolve, reject) => {
        validationSchema.validate(objectData, { abortEarly: false })
          .then((data: any) => {
            resolve([true, data[fieldName]]);
          })
          .catch((err:any) => {
            resolve([false, err.message]);
          });
    });
};

const validateObject = async (validationSchema: any, objectData: object): Promise<[boolean,object]> => {
    return new Promise((resolve, reject) => {
        validationSchema.validate(objectData, { abortEarly: false })
          .then((data: any) => {
            resolve([true, data]);
          })
          .catch((err:any) => {
            resolve([false, err.message]);
          });
    });
};

export { validateField, validateObject };