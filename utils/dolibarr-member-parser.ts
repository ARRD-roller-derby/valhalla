import { IUser } from '@/models'
import { ROLES_CAN_MANAGE_EVENT } from './constants'
import { checkRoles } from './check-roles'
import { IDolibarrMember } from '@/entities'

export function dolibarrMemberParser(
  dolibarrData: any,
  user: IUser,
  providerAccountId: string
): Partial<IDolibarrMember> {
  const dolibarrInfos: Partial<IDolibarrMember> = {}
  if (dolibarrData.length > 0) {
    const dolibarrMember = dolibarrData[0]
    const canSeePrivateInfos = checkRoles(ROLES_CAN_MANAGE_EVENT, user) || user.id === providerAccountId

    if (dolibarrMember) {
      dolibarrInfos.type = dolibarrMember.type
      dolibarrInfos.birth = dolibarrMember.birth
      dolibarrInfos.gender = dolibarrMember.gender
      dolibarrInfos.options_derbyname = dolibarrMember.array_options.options_derbyname
      dolibarrInfos.options_nroster = dolibarrMember.array_options.options_nroster
    }

    if (canSeePrivateInfos) {
      dolibarrInfos.datefin = dolibarrMember.datefin
      dolibarrInfos.options_nlicence = dolibarrMember.array_options.options_nlicence
      dolibarrInfos.options_allergies = dolibarrMember.array_options.options_allergies
      dolibarrInfos.options_rgimealimentaire = dolibarrMember.array_options.options_rgimealimentaire
      dolibarrInfos.first_subscription_date_start = dolibarrMember.first_subscription_date_start
      dolibarrInfos.first_subscription_date_end = dolibarrMember.first_subscription_date_end
      dolibarrInfos.first_subscription_date = dolibarrMember.first_subscription_date
      dolibarrInfos.first_subscription_amount = dolibarrMember.first_subscription_amount
      dolibarrInfos.last_subscription_amount = dolibarrMember.last_subscription_amount
      dolibarrInfos.phone_perso = dolibarrMember.phone_perso
      dolibarrInfos.town = dolibarrMember.town
      dolibarrInfos.zip = dolibarrMember.zip
      dolibarrInfos.address = dolibarrMember.address
    }
  }

  return dolibarrInfos
}
