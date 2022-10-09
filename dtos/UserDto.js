module.exports = class UserDto {
  email
  id
  isActivated
  role

  constructor(model) {
    this.email = model.email
    this.id = model._id
    this.isActivated = model.isActivated
    this.tgAccount = model.tgAccount
    this.role = model.role
  }
}
