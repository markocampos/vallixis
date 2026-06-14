import PageMeta from '../components/PageMeta'
import { APP_NAME } from '../lib/constants'

export default function Manifesto() {
  return (
    <>
      <PageMeta title="Manifesto" description={`The ${APP_NAME} manifesto: why we exist.`} />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto">
          <h1 className="text-heading-lg text-gray-900 mb-2">The {APP_NAME} manifesto</h1>
          <p className="text-caption text-gray-400 mb-10 uppercase tracking-widest">Why we exist</p>

          <div className="space-y-8 text-body-md text-gray-700 leading-relaxed">
            <p>
              There are millions of solo entrepreneurs in the Philippines. Bakers, tutors, repair technicians, designers, photographers, freelancers. People who are great at what they do, and who deserve to be found online.
            </p>
            <p>
              But building a website is hard. It costs too much. It takes too long. It requires skills most people don't have time to learn. And so these businesses stay invisible.
            </p>
            <p className="text-primary font-semibold text-xl">
              We think that's wrong. And we're fixing it.
            </p>
            <p>
              {APP_NAME} exists to remove every barrier between a solo entrepreneur and a professional online presence. No code. No complicated dashboards. No expensive developers. Just you, your story, and a live website in under two minutes.
            </p>
            <p>
              We are built for the Philippine market. Prices in Peso. Payments via PayMongo. Support in Filipino hours. We're not a foreign product pretending to care about local businesses. We are local.
            </p>
            <p>
              If you run a business and you're not online yet, this is for you.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
