import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from "class-validator"

export function IsEqualsTo(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsEqualsTo",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return (
            typeof value === "string" &&
            typeof relatedValue === "string" &&
            value === relatedValue
          )
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints

          return propertyName.concat(
            " field value is not equals to ",
            relatedPropertyName,
            " field value"
          )
        }
      }
    })
  }
}
