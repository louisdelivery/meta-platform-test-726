import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneField', async: false })
export default class AtLeastOneField implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as Record<string, any>;
    return Object.values(object).some(
      (value) => value !== undefined && value !== null,
    );
  }

  defaultMessage() {
    return 'At least one field must be provided for update.';
  }
}
