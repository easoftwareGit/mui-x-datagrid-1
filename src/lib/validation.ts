/* eslint-disable @typescript-eslint/no-explicit-any */
export const maxFirstNameLength = 15;
export const maxLastNameLength = 20;
export const maxEmailLength = 30;
export const maxPhoneLength = 20;
export const maxPasswordLength = 20;

export const maxBowlNameLemgth = 30;
export const maxCityLength = 25;
export const maxStateLength = 5
export const maxUrlLength = 2048;

export const maxToHashLength = 72;
export const bcryptLength = 60; // https://www.npmjs.com/package/bcrypt

export const maxTmntNameLength = 30;
export const maxEventLength = 20;

export const minTeamSize = 1;
export const maxTeamSize = 5;
export const minGames = 1;
export const maxGames = 99;
export const minStartLane = 1;
export const maxStartLane = 199;
export const minLaneCount = 2;
export const maxLaneCount = 200;
export const maxBrackets = 999;
export const maxEvents = 10;
export const minHdcpPer = 0;
export const maxHdcpPer = 1.25;
export const minHdcpFrom = 0;
export const maxHdcpFrom = 300;
export const zeroAmount = 0;
export const minFee = 1;
export const maxMoney = 999999;

export const minSortOrder = 1;
export const maxSortOrder = 1000000;

export const minYear = 1900;
export const maxYear = 2200;
export const minDate = new Date(Date.UTC(minYear, 0, 1, 0, 0, 0, 0))
export const maxDate = new Date(Date.UTC(maxYear, 11, 31, 23, 59, 59, 999));

export const minLane = 1;

export enum ErrorCode {
  None = 0,
  MissingData = -1,
  InvalidData = -2,    
  OtherError = -99,
}

/**
 * checks if string is in a valid email format
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str has a valid email format;
 */
export function isEmail(str: string): boolean {
  if ((str.match(/@/g) || []).length !== 1) {
    return false
  }
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(str);
}

/**
 * checks if string is a valid password
 *  8-20 chars long
 *  at least 1 UPPER case char
 *  at least 1 lower case char
 *  at least 1 digit
 *  at least on special char
 *
 * @param {string} str
 * @return {*}  {boolean} - true: str has a valid password format;
 */
export function isPassword8to20(str: string): boolean {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
  return regex.test(str);
}

/**
 * checks if numStr is a valid positive integer
 * 
 * @param {string} numStr - number to test
 * @returns {boolean} - true if numStr is a valid positive integer
 */
export const validPositiveInt = (numStr: string): boolean => {
  if (!numStr) return false;
  return /^[1-9]\d*$/.test(numStr);
}

/**
 * checks if a numeber is odd
 * 
 * @param num - number to test
 * @returns {boolean} - true if number is odd
 */
export const isOdd = (num: number): boolean => {
  return num % 2 !== 0;
}

/**
 * checks if a numeber is even
 * 
 * @param num - number to test
 * @returns {boolean} - true if number is odd
 */
export const isEven = (num: number): boolean => {
  return !isOdd(num);
}

/**
 * checks to see if value is a number
 * 
 * @param value - value to test
 * @returns {boolean} - true if value is a number
 */
export const isNumber = (value: any): boolean => { 
  return typeof value === 'number' && isFinite(value);
}
