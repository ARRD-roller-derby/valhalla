import { useMember } from '@/entities'
import { MemberRoles } from './member-roles'
import dayjs from 'dayjs'
import { DIET } from '@/utils'
import { BadgeCard } from '../badge'
import { sortedBadges } from '@/utils/sort-badges'

export function MemberDetails() {
  const { member, badges } = useMember()

  const diet = DIET.find((diet) => diet.value === (member?.options_rgimealimentaire || '0'))

  console.log('member', badges)
  return (
    <div className="m-auto flex w-full flex-col gap-4 px-3 sm:w-96">
      <main className="m-auto flex w-full flex-col gap-4 sm:w-96 ">
        {member.datefin && (
          <div>
            Membre jusqu'au <span className="text-arrd-highlight">{dayjs(member.datefin * 1000).format('LL')}</span>
          </div>
        )}
        {member.type && (
          <div>
            Type de licence: <span className="text-arrd-highlight">{member.type}</span>
          </div>
        )}
        {(member.options_nlicence || member.options_nroster || member.options_derbyname) && (
          <div className="rounded border border-arrd-border p-2">
            {member.options_nlicence && (
              <div>
                N° de licence: <span className="text-arrd-highlight">{member.options_nlicence}</span>
              </div>
            )}
            {member.options_nroster && (
              <div>
                N° de roster: <span className="text-arrd-highlight">{member.options_nroster}</span>
              </div>
            )}
            {member.options_derbyname && (
              <div>
                Derby name: <span className="text-arrd-highlight">{member.options_derbyname}</span>
              </div>
            )}
          </div>
        )}

        {diet && (
          <div>
            Régime alimentaire: <span className="text-arrd-highlight">{diet?.label}</span>
          </div>
        )}

        {member.options_allergies && (
          <div>
            Allergies: <span className="text-arrd-highlight">{member.options_allergies}</span>
          </div>
        )}
        <div className="flex items-end">
          <MemberRoles />
        </div>
        <div className="flex flex-col gap-4">
          {badges.length === 0 ? (
            <div>Aucun badge</div>
          ) : (
            <div className="text-center text-arrd-highlight">
              {badges.length} Badge{badges.length > 1 ? 's' : ''}
            </div>
          )}

          {badges.sort(sortedBadges).map((badge) => (
            <BadgeCard key={`${badge._id}`} badge={badge} readonly />
          ))}
        </div>
      </main>
    </div>
  )
}
