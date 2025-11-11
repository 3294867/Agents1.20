import constants from 'src/constants';

const processResponse = ({ response }: {response: string}) => {
    let accumulatedResponse = "";
    accumulatedResponse += response;
    accumulatedResponse =  accumulatedResponse.replace(/^\[|,/, "");

    const completeMatch = accumulatedResponse.match(constants.regex.responseComplete);
    const incompleteMatch = accumulatedResponse.match(constants.regex.responseIncomplete);

    if (completeMatch) {
        const parsedOutput = JSON.parse(accumulatedResponse);
        parsedOutput.status = "completed"
        accumulatedResponse = "";
        return parsedOutput;
    } else if (incompleteMatch) {
        const closingString = accumulatedResponse[accumulatedResponse.length - 1] === "\""
            ? "}"
            : "\"}"
        const parsedOutput = JSON.parse(accumulatedResponse + closingString);
        parsedOutput.status = "in-progress";
        return parsedOutput;
    }
};

export default processResponse;