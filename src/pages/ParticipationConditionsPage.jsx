import SectionContainer from '../components/SectionContainer'

function ParticipationConditionsPage() {
  return (
    <SectionContainer>
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-primary-100 bg-white p-6 text-primary-500 shadow-sm md:p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-primary-600">Conditions de participation</h1>
          <p className="font-semibold">SMARA INVEST EXPERIENCE 2026</p>
          <p className="text-sm text-primary-400">Du 10 au 13 juillet 2026</p>
        </header>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <p>
            Le SMARA INVEST EXPERIENCE est une initiative portée par l Association NORD SUD ACTION, en partenariat avec plusieurs
            acteurs institutionnels et économiques, dans le but de promouvoir les opportunités d investissement et le développement
            territorial de la province d Es-Smara.
          </p>
          <p>La cotisation de participation est fixée à 1 500 DH par personne.</p>
          <p>
            Cette contribution symbolique ne couvre qu une partie des frais réels engagés pour l organisation de l événement. Une grande
            partie de la logistique et des prestations est prise en charge par l Association NORD SUD ACTION et ses partenaires afin de
            rendre cette expérience accessible au plus grand nombre de porteurs de projets, investisseurs et entrepreneurs intéressés par la
            région.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary-600">La participation comprend notamment :</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-primary-500">
            <li>Le billet d avion aller/retour Casablanca - Es-Smara</li>
            <li>L hébergement pendant 3 nuits</li>
            <li>La restauration durant toute la durée du séjour</li>
            <li>L accès aux conférences et rencontres professionnelles</li>
            <li>Les sessions de networking et de mise en relation</li>
            <li>Les excursions et activités prévues dans le programme officiel</li>
            <li>La soirée bivouac et les animations culturelles</li>
            <li>L expérience d observation du ciel étoilé</li>
            <li>Les transports locaux liés au programme officiel</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary-600">Conditions générales</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-primary-500">
            <li>Les places étant limitées, les inscriptions seront validées selon l ordre de confirmation et de règlement de la cotisation.</li>
            <li>Toute inscription est personnelle et non transférable sans validation préalable de l organisation.</li>
            <li>L organisation se réserve le droit de sélectionner les profils afin de garantir la cohérence et la qualité des échanges.</li>
            <li>Les participants s engagent à respecter les consignes de sécurité, le programme officiel et les règles de bonne conduite.</li>
            <li>En cas d annulation par le participant moins de 10 jours avant l événement, les frais engagés pourront être retenus.</li>
            <li>L organisation se réserve le droit d adapter certaines activités ou le programme selon les contraintes logistiques, climatiques ou sécuritaires.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <h2 className="text-lg font-semibold text-primary-600">Assurance & responsabilité</h2>
          <p>
            Chaque participant demeure personnellement responsable de sa couverture médicale, de son assurance voyage et de tout risque
            lié à sa participation à l événement et aux activités programmées.
          </p>
          <p>L Association NORD SUD ACTION ainsi que ses partenaires déclinent toute responsabilité en cas :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>d accident,</li>
            <li>de maladie,</li>
            <li>de blessure,</li>
            <li>de perte ou vol d effets personnels,</li>
            <li>ou de tout incident survenu en dehors du cadre de responsabilité directe de l organisation.</li>
          </ul>
          <p>Il est fortement recommandé aux participants de disposer d une assurance personnelle adaptée avant leur participation.</p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-primary-500">
          <h2 className="text-lg font-semibold text-primary-600">Droit à l image</h2>
          <p>
            Les participants autorisent l utilisation des photos et vidéos réalisées durant l événement à des fins de communication et de
            promotion liées au SMARA INVEST EXPERIENCE.
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-600">
          <h2 className="font-semibold">Validation</h2>
          <p>☐ Je reconnais avoir pris connaissance des présentes conditions de participation et les accepter pleinement.</p>
          <p>☐ Je confirme l exactitude des informations renseignées dans mon formulaire d inscription.</p>
        </section>
      </div>
    </SectionContainer>
  )
}

export default ParticipationConditionsPage
