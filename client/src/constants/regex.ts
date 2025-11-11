const responseComplete = /^\{\s*"type":"(?:text|bullet-list|table)",\s*"content":"(?:[^"\\]|\\.)*"\}\s*$/;
const responseIncomplete = /^(?![\s\S]*\})\s*\{\s*"type":"(?:text|bullet-list|table)",\s*"content":[\s\S]*$/;

const regex = {
    responseComplete,
    responseIncomplete,
};

export default regex;