// /** @format */

// export function convertWindSpeed(speedInMetersPerSecond: number): string {
//     const speedInKilometersPerHour = speedInMetersPerSecond * 3.6; // Conversion from m/s to km/h
//     const speedInMilesPerHour = speedInMetersPerSecond * 2.237; // Conversion from m/s to mph
//     return `${speedInKilometersPerHour.toFixed(0)} km/h (${speedInMilesPerHour.toFixed(0)} mph)`; // Round to 0 decimal places and add units
//   }

/** @format */

export function convertWindSpeed(speedInMetersPerSecond: number): string {
    const speedInMilesPerHour = speedInMetersPerSecond * 2.237; // Conversion from m/s to mph
    return `${speedInMilesPerHour.toFixed(0)} mph`; // Round to 0 decimal places and add 'mph' unit
  }