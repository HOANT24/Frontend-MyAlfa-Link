import { Shield, Mail, ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#840040]" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none">ALFA Partenaires</p>
              <h1 className="text-sm font-semibold text-slate-800 leading-tight">
                Politique de confidentialité
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs text-slate-400 mb-1">Dernière mise à jour</p>
          <p className="text-sm font-medium text-slate-700">8 juin 2026</p>
        </div>

        <Section title="1. Présentation">
          <p>
            La présente politique de confidentialité décrit la manière dont{" "}
            <strong>ALFA Partenaires</strong> collecte, utilise et protège les données
            personnelles des utilisateurs de l'application mobile et de la plateforme web{" "}
            <strong>MyALFA Link</strong>.
          </p>
          <p className="mt-3">
            En utilisant MyALFA Link, vous acceptez les pratiques décrites dans la présente
            politique. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre
            application.
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p className="font-medium text-slate-700 mb-2">
            Nous collectons uniquement les données nécessaires au fonctionnement du service :
          </p>
          <ul className="space-y-2 mt-2">
            <Item label="Adresse e-mail" desc="Utilisée pour identifier votre compte client et accéder à votre espace personnel." />
            <Item label="Code PIN" desc="Stocké localement sur l'appareil sous forme chiffrée. Il n'est jamais transmis à nos serveurs." />
            <Item label="Données de session" desc="Un identifiant de session est conservé dans le stockage local (localStorage) de votre appareil pour maintenir votre connexion." />
          </ul>
          <p className="mt-4 text-slate-500 text-sm">
            Nous ne collectons pas votre localisation géographique, vos contacts, votre
            appareil photo ni aucune autre donnée personnelle sensible.
          </p>
        </Section>

        <Section title="3. Finalité du traitement">
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <Li>Authentifier l'utilisateur et sécuriser l'accès à son espace client ;</Li>
            <Li>Afficher les documents comptables, fiscaux, sociaux et juridiques associés à votre dossier ;</Li>
            <Li>Permettre la consultation des demandes, rendez-vous et questionnaires ;</Li>
            <Li>Assurer la sécurité de l'application (verrouillage par PIN après inactivité).</Li>
          </ul>
        </Section>

        <Section title="4. Conservation des données">
          <p>
            Les données de session sont stockées localement sur votre appareil et supprimées
            lors de la déconnexion. Les données métier (documents, demandes, etc.) sont
            hébergées sur les serveurs sécurisés d'ALFA Partenaires et conservées conformément
            aux obligations légales comptables et fiscales en vigueur.
          </p>
        </Section>

        <Section title="5. Partage avec des tiers">
          <p>
            ALFA Partenaires ne vend, ne loue et ne partage pas vos données personnelles avec
            des tiers à des fins commerciales.
          </p>
          <p className="mt-3 font-medium text-slate-700">
            Prestataires techniques impliqués :
          </p>
          <ul className="mt-2 space-y-2">
            <Item label="Vercel" desc="Hébergement de l'application web (traitement aux États-Unis, couvert par des clauses contractuelles standard RGPD)." />
            <Item label="Google Play Store" desc="Distribution de l'application Android. Google peut collecter des données d'utilisation anonymes selon ses propres règles de confidentialité." />
          </ul>
        </Section>

        <Section title="6. Sécurité">
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données contre tout accès non autorisé, perte ou destruction :
          </p>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <Li>Communication chiffrée via HTTPS (TLS) ;</Li>
            <Li>Code PIN chiffré stocké localement via flutter_secure_storage ;</Li>
            <Li>Verrouillage automatique de l'application après 30 secondes d'inactivité en arrière-plan ;</Li>
            <Li>Accès aux données restreint au cabinet ALFA Partenaires.</Li>
          </ul>
        </Section>

        <Section title="7. Vos droits (RGPD)">
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous
            disposez des droits suivants sur vos données personnelles :
          </p>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <Li>Droit d'accès à vos données ;</Li>
            <Li>Droit de rectification des données inexactes ;</Li>
            <Li>Droit à l'effacement (« droit à l'oubli ») dans les limites des obligations légales ;</Li>
            <Li>Droit à la portabilité de vos données ;</Li>
            <Li>Droit d'opposition au traitement.</Li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.
          </p>
        </Section>

        <Section title="8. Cookies et stockage local">
          <p>
            MyALFA Link utilise le stockage local du navigateur (localStorage) pour conserver
            votre session de connexion. Aucun cookie publicitaire ou de tracking tiers n'est
            utilisé.
          </p>
        </Section>

        <Section title="9. Modifications de la politique">
          <p>
            ALFA Partenaires se réserve le droit de modifier la présente politique de
            confidentialité à tout moment. Toute modification sera notifiée par une mise à
            jour de la date en haut de cette page. L'utilisation continue de l'application
            après modification vaut acceptation des nouvelles conditions.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Pour toute question relative à la présente politique ou pour exercer vos droits,
            contactez le responsable du traitement :
          </p>
          <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-[#840040]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">ALFA Partenaires</p>
              <p className="text-sm text-slate-500">contact@alfa-partenaires.com</p>
            </div>
          </div>
        </Section>

        <div className="text-center text-xs text-slate-400 pb-4">
          © 2026 ALFA Partenaires — Tous droits réservés
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

function Item({ label, desc }) {
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#840040] flex-shrink-0" />
      <span>
        <span className="font-medium text-slate-700">{label} — </span>
        {desc}
      </span>
    </li>
  );
}

function Li({ children }) {
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
