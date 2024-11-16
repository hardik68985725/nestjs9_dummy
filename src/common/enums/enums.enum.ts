export enum user_roles {
  owner = "owner",
  marketing_head = "marketing_head",
  area_marketing_head = "area_marketing_head",
  sales_officer = "sales_officer",
  dealer = "dealer",
  dispatcher = "dispatcher",
  accountant = "accountant"
}

export enum status {
  active = "active",
  inactive = "inactive"
}

export enum firm_types {
  proprietor = "proprietor",
  partnership = "partnership",
  private_limited = "private_limited",
  other = "other"
}

export enum uploads_folders {
  profile_picture = "profile_picture",
  product_picture = "product_picture"
}

export enum order_status {
  inprogress = "inprogress", // initial(default) status
  approved = "approved", // by dispatcher after verify with accountant
  declined = "declined", // by dispatcher after verify with accountant
  canceled = "canceled", // by sales_officer or dealer
  completed = "completed" // by dispatcher
}
