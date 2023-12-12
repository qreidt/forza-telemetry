import {Buffer} from "memfs/lib/internal/buffer";


type Instruction = {
  position: number,
  length: number,
  name: keyof DataPacket,
  format: 's32' | 'u32' | 'f32' | 'u16' | 's8' | 'u8',
  transform: null|DataTransform,
  upload: boolean
};

type DataPacket = {
  IsRaceOn: boolean,
  SessionTimeMS: number,
  EngineMaxRpm: number,
  EngineIdleRpm: number,
  CurrentEngineRpm: number,
  AccelerationX: number,
  AccelerationY: number,
  AccelerationZ: number,
  VelocityX: number,
  VelocityY: number,
  VelocityZ: number,
  AngularVelocityX: number,
  AngularVelocityY: number,
  AngularVelocityZ: number,
  Yaw: number,
  Pitch: number,
  Roll: number,
  NormalizedSuspensionTravelFrontLeft: number,
  NormalizedSuspensionTravelFrontRight: number,
  NormalizedSuspensionTravelRearLeft: number,
  NormalizedSuspensionTravelRearRight: number,
  TireSlipRatioFrontLeft: number,
  TireSlipRatioFrontRight: number,
  TireSlipRatioRearLeft: number,
  TireSlipRatioRearRight: number,
  WheelRotationSpeedFrontLeft: number,
  WheelRotationSpeedFrontRight: number,
  WheelRotationSpeedRearLeft: number,
  WheelRotationSpeedRearRight: number,
  WheelOnRumbleStripFrontLeft: number,
  WheelOnRumbleStripFrontRight: number,
  WheelOnRumbleStripRearLeft: number,
  WheelOnRumbleStripRearRight: number,
  WheelInPuddleDepthFrontLeft: number,
  WheelInPuddleDepthFrontRight: number,
  WheelInPuddleDepthRearLeft: number,
  WheelInPuddleDepthRearRight: number,
  SurfaceRumbleFrontLeft: number,
  SurfaceRumbleFrontRight: number,
  SurfaceRumbleRearLeft: number,
  SurfaceRumbleRearRight: number,
  TireSlipAngleFrontLeft: number,
  TireSlipAngleFrontRight: number,
  TireSlipAngleRearLeft: number,
  TireSlipAngleRearRight: number,
  TireCombinedSlipFrontLeft: number,
  TireCombinedSlipFrontRight: number,
  TireCombinedSlipRearLeft: number,
  TireCombinedSlipRearRight: number,
  SuspensionTravelMetersFrontLeft: number,
  SuspensionTravelMetersFrontRight: number,
  SuspensionTravelMetersRearLeft: number,
  SuspensionTravelMetersRearRight: number,
  CarOrdinal: number,
  CarClass: number,
  CarPerformanceIndex: number,
  DrivetrainType: number,
  NumCylinders: number,
  PositionX: number,
  PositionY: number,
  PositionZ: number,
  Speed: number,
  Power: number,
  Torque: number,
  TireTempFrontLeft: number,
  TireTempFrontRight: number,
  TireTempRearLeft: number,
  TireTempRearRight: number,
  Boost: number,
  Fuel: number,
  DistanceTraveled: number,
  BestLap: number,
  LastLap: number,
  CurrentLap: number,
  CurrentRaceTime: number,
  LapNumber: number,
  RacePosition: number,
  Accel: number,
  Brake: number,
  Clutch: number,
  HandBrake: number,
  Gear: number,
  Steer: number,
  NormalizedDrivingLine: number,
  NormalizedAIBrakeDifference: number,
  TireWearFrontLeft: number,
  TireWearFrontRight: number,
  TireWearRearLeft: number,
  TireWearRearRight: number,
  TrackOrdinal: number,
};

enum DataTransform {
  Boolean = 'BOOLEAN',
  FarenheitToCelsius = 'FARENHEIT_TO_CELCIUS',
}

class DataPacketService {

  public instructions: Instruction[];

  constructor() {
    this.instructions = DataPacketService.getInstructions();
  }

  private static getInstructions(): Instruction[] {
    return [
      {position: 0, length: 4, name: 'IsRaceOn', format: 's32', transform: DataTransform.Boolean, upload: true},
      {position: 4, length: 4, name: 'SessionTimeMS', format: 'u32', transform: null, upload: true},
      {position: 8, length: 4, name: 'EngineMaxRpm', format: 'f32', transform: null, upload: true},
      {position: 12, length: 4, name: 'EngineIdleRpm', format: 'f32', transform: null, upload: true},
      {position: 16, length: 4, name: 'CurrentEngineRpm', format: 'f32', transform: null, upload: true},
      {position: 20, length: 4, name: 'AccelerationX', format: 'f32', transform: null, upload: false},
      {position: 24, length: 4, name: 'AccelerationY', format: 'f32', transform: null, upload: false},
      {position: 28, length: 4, name: 'AccelerationZ', format: 'f32', transform: null, upload: false},
      {position: 32, length: 4, name: 'VelocityX', format: 'f32', transform: null, upload: false},
      {position: 36, length: 4, name: 'VelocityY', format: 'f32', transform: null, upload: false},
      {position: 40, length: 4, name: 'VelocityZ', format: 'f32', transform: null, upload: false},
      {position: 44, length: 4, name: 'AngularVelocityX', format: 'f32', transform: null, upload: false},
      {position: 48, length: 4, name: 'AngularVelocityY', format: 'f32', transform: null, upload: false},
      {position: 52, length: 4, name: 'AngularVelocityZ', format: 'f32', transform: null, upload: false},
      {position: 56, length: 4, name: 'Yaw', format: 'f32', transform: null, upload: false},
      {position: 60, length: 4, name: 'Pitch', format: 'f32', transform: null, upload: false},
      {position: 64, length: 4, name: 'Roll', format: 'f32', transform: null, upload: false},
      {position: 68, length: 4, name: 'NormalizedSuspensionTravelFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 72, length: 4, name: 'NormalizedSuspensionTravelFrontRight', format: 'f32', transform: null, upload: false},
      {position: 76, length: 4, name: 'NormalizedSuspensionTravelRearLeft', format: 'f32', transform: null, upload: false},
      {position: 80, length: 4, name: 'NormalizedSuspensionTravelRearRight', format: 'f32', transform: null, upload: false},
      {position: 84, length: 4, name: 'TireSlipRatioFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 88, length: 4, name: 'TireSlipRatioFrontRight', format: 'f32', transform: null, upload: false},
      {position: 92, length: 4, name: 'TireSlipRatioRearLeft', format: 'f32', transform: null, upload: false},
      {position: 96, length: 4, name: 'TireSlipRatioRearRight', format: 'f32', transform: null, upload: false},
      {position: 100, length: 4, name: 'WheelRotationSpeedFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 104, length: 4, name: 'WheelRotationSpeedFrontRight', format: 'f32', transform: null, upload: false},
      {position: 108, length: 4, name: 'WheelRotationSpeedRearLeft', format: 'f32', transform: null, upload: false},
      {position: 112, length: 4, name: 'WheelRotationSpeedRearRight', format: 'f32', transform: null, upload: false},
      {position: 116, length: 4, name: 'WheelOnRumbleStripFrontLeft', format: 's32', transform: null, upload: false},
      {position: 120, length: 4, name: 'WheelOnRumbleStripFrontRight', format: 's32', transform: null, upload: false},
      {position: 124, length: 4, name: 'WheelOnRumbleStripRearLeft', format: 's32', transform: null, upload: false},
      {position: 128, length: 4, name: 'WheelOnRumbleStripRearRight', format: 's32', transform: null, upload: false},
      {position: 132, length: 4, name: 'WheelInPuddleDepthFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 136, length: 4, name: 'WheelInPuddleDepthFrontRight', format: 'f32', transform: null, upload: false},
      {position: 140, length: 4, name: 'WheelInPuddleDepthRearLeft', format: 'f32', transform: null, upload: false},
      {position: 144, length: 4, name: 'WheelInPuddleDepthRearRight', format: 'f32', transform: null, upload: false},
      {position: 148, length: 4, name: 'SurfaceRumbleFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 152, length: 4, name: 'SurfaceRumbleFrontRight', format: 'f32', transform: null, upload: false},
      {position: 156, length: 4, name: 'SurfaceRumbleRearLeft', format: 'f32', transform: null, upload: false},
      {position: 160, length: 4, name: 'SurfaceRumbleRearRight', format: 'f32', transform: null, upload: false},
      {position: 164, length: 4, name: 'TireSlipAngleFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 168, length: 4, name: 'TireSlipAngleFrontRight', format: 'f32', transform: null, upload: false},
      {position: 172, length: 4, name: 'TireSlipAngleRearLeft', format: 'f32', transform: null, upload: false},
      {position: 176, length: 4, name: 'TireSlipAngleRearRight', format: 'f32', transform: null, upload: false},
      {position: 180, length: 4, name: 'TireCombinedSlipFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 184, length: 4, name: 'TireCombinedSlipFrontRight', format: 'f32', transform: null, upload: false},
      {position: 188, length: 4, name: 'TireCombinedSlipRearLeft', format: 'f32', transform: null, upload: false},
      {position: 192, length: 4, name: 'TireCombinedSlipRearRight', format: 'f32', transform: null, upload: false},
      {position: 196, length: 4, name: 'SuspensionTravelMetersFrontLeft', format: 'f32', transform: null, upload: false},
      {position: 200, length: 4, name: 'SuspensionTravelMetersFrontRight', format: 'f32', transform: null, upload: false},
      {position: 204, length: 4, name: 'SuspensionTravelMetersRearLeft', format: 'f32', transform: null, upload: false},
      {position: 208, length: 4, name: 'SuspensionTravelMetersRearRight', format: 'f32', transform: null, upload: false},
      {position: 212, length: 4, name: 'CarOrdinal', format: 's32', transform: null, upload: true},
      {position: 216, length: 4, name: 'CarClass', format: 's32', transform: null, upload: true},
      {position: 220, length: 4, name: 'CarPerformanceIndex', format: 's32', transform: null, upload: true},
      {position: 224, length: 4, name: 'DrivetrainType', format: 's32', transform: null, upload: true},
      {position: 228, length: 4, name: 'NumCylinders', format: 's32', transform: null, upload: true},
      {position: 232, length: 4, name: 'PositionX', format: 'f32', transform: null, upload: true},
      {position: 236, length: 4, name: 'PositionY', format: 'f32', transform: null, upload: true},
      {position: 240, length: 4, name: 'PositionZ', format: 'f32', transform: null, upload: true},
      {position: 244, length: 4, name: 'Speed', format: 'f32', transform: null, upload: true},
      {position: 248, length: 4, name: 'Power', format: 'f32', transform: null, upload: true},
      {position: 252, length: 4, name: 'Torque', format: 'f32', transform: null, upload: true},
      {position: 256, length: 4, name: 'TireTempFrontLeft', format: 'f32', transform: DataTransform.FarenheitToCelsius, upload: true},
      {position: 260, length: 4, name: 'TireTempFrontRight', format: 'f32', transform: DataTransform.FarenheitToCelsius, upload: true},
      {position: 264, length: 4, name: 'TireTempRearLeft', format: 'f32', transform: DataTransform.FarenheitToCelsius, upload: true},
      {position: 268, length: 4, name: 'TireTempRearRight', format: 'f32', transform: DataTransform.FarenheitToCelsius, upload: true},
      {position: 272, length: 4, name: 'Boost', format: 'f32', transform: null, upload: false},
      {position: 276, length: 4, name: 'Fuel', format: 'f32', transform: null, upload: true},
      {position: 280, length: 4, name: 'DistanceTraveled', format: 'f32', transform: null, upload: true},
      {position: 284, length: 4, name: 'BestLap', format: 'f32', transform: null, upload: true},
      {position: 288, length: 4, name: 'LastLap', format: 'f32', transform: null, upload: true},
      {position: 292, length: 4, name: 'CurrentLap', format: 'f32', transform: null, upload: true},
      {position: 296, length: 4, name: 'CurrentRaceTime', format: 'f32', transform: null, upload: true},
      {position: 300, length: 2, name: 'LapNumber', format: 'u16', transform: null, upload: true},
      {position: 302, length: 1, name: 'RacePosition', format: 'u8', transform: null, upload: true},
      {position: 303, length: 1, name: 'Accel', format: 'u8', transform: null, upload: true},
      {position: 304, length: 1, name: 'Brake', format: 'u8', transform: null, upload: true},
      {position: 305, length: 1, name: 'Clutch', format: 'u8', transform: null, upload: false},
      {position: 306, length: 1, name: 'HandBrake', format: 'u8', transform: null, upload: true},
      {position: 307, length: 1, name: 'Gear', format: 'u8', transform: null, upload: true},
      {position: 308, length: 1, name: 'Steer', format: 's8', transform: null, upload: true},
      {position: 309, length: 1, name: 'NormalizedDrivingLine', format: 's8', transform: null, upload: false},
      {position: 310, length: 1, name: 'NormalizedAIBrakeDifference', format: 's8', transform: null, upload: false},
      {position: 311, length: 4, name: 'TireWearFrontLeft', format: 'f32', transform: null, upload: true},
      {position: 315, length: 4, name: 'TireWearFrontRight', format: 'f32', transform: null, upload: true},
      {position: 319, length: 4, name: 'TireWearRearLeft', format: 'f32', transform: null, upload: true},
      {position: 323, length: 4, name: 'TireWearRearRight', format: 'f32', transform: null, upload: true},
      {position: 327, length: 4, name: 'TrackOrdinal', format: 's32', transform: null, upload: true},
    ];
  }

  public parseDataPacket(bytes: Buffer): DataPacket {
    const data = {};

    for (let instruction of this.instructions) {
      const value = this.parseBytes(bytes, instruction.format, instruction.position);
      data[instruction.name] = this.applyTransformation(value, instruction.transform);
    }

    return data as DataPacket;
  }

  public parseBytes(buffer, type, position): number {
    switch (type) {
      // Float
      case "f32": return buffer.readFloatLE(position);

      // Unsigned Integer
      case 'u8': return buffer.readUInt8(position)
      case 'u16': return buffer.readUInt16LE(position)
      case 'u32': return buffer.readUInt32LE(position)

      // Signed Integer
      case 's8': return buffer.readInt8(position)
      case 's16': return buffer.readInt16LE(position)
      case 's32': return buffer.readInt32LE(position)
    }

    return 0;
  }

  private applyTransformation(value: number, transform: DataTransform|null): number|boolean
  {
    switch (transform) {
      case DataTransform.Boolean: return Boolean(value);
      case DataTransform.FarenheitToCelsius: return (value - 32) * 5/9;
      default: return value;
    }
  }

}

export default new DataPacketService();
