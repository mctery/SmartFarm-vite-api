
  function bitsToByte(bits) {
    if (bits.length !== 8) {
        throw new Error('Bit array must have exactly 8 bits');
    }

    return (bits[7] << 7) |
        (bits[6] << 6) |
        (bits[5] << 5) |
        (bits[4] << 4) |
        (bits[3] << 3) |
        (bits[2] << 2) |
        (bits[1] << 1) |
        (bits[0]);
}

//                MON    TUE    WED    THUR   FRI    SAT    SUN
let inputBits = [false, false, false, false, false, false, false, false];

// select your day and change status of bit to true to select that day and give your
// {"id" :1 , "check_on" : "7f" , "index_timeinput" : 1 , "day" : 12 , "schedule_hour_on" : 5 , "schedule_min_on" : 13,  "schedule_hour_off" : 5 , "schedule_min_off" : 12}
// output to send to mqtt on check_on by string data type

const byteValue = bitsToByte(inputBits);
let output = byteValue.toString(16);
console.log("Week Hex Code : " , output);
