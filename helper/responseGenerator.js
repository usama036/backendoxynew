module.exports = response;

function response(status, message, data, model = []) {
    if (typeof (data) === 'object' && data) {

        if(model == ''){
            return [
                {
                    status : status,
                    message : message,
                    data : data
                }
            ]
        }
       return [
           {
               status : status,
               message : message,
               data : data,
               otherFields : model,
           }
       ]

    }else if (typeof (data) === 'number' && data) {
        return [
            {
                status : status,
                count : data,
                message : message,
            }
        ]
    }
    else{
        return [
            {
                status : status,
                message : message,
            }
        ]
    }
}