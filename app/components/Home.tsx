import React from "react";
import EventForm from "./EventForm";
import { Languages, Clock, Ticket, MapPin } from "lucide-react";

const Home: React.FC = () => {
  return (
    <main className="main-wrapper">
      <div className="content-grid">
        {/* Left Column: Context/Description */}
        <div className="context-column">
          {/* Event Hero Image - Moved here */}
          <div className="event-hero-wrapper">
            <img src="/hero.webp" alt="Event Hero" className="event-hero-img" />
          </div>

          {/* About Section */}
          <section>
            <h2 className="section-title">About the Event</h2>
            <div className="event-description-wrapper">
              <p className="event-description">
                <strong>
                  Mocha Mono Vol. 1 was a hit — and with all the love you showed
                  us, we’re back with Volume 2.
                </strong>
              </p>
              <p className="event-description">Before playlists,</p>
              <p className="event-description">Before algorithms,</p>
              <p className="event-description">
                There was vinyl, mixtapes, and real listening.
              </p>
              <p className="event-description" style={{ marginTop: "14px" }}>
                Mocha Mono is Bhubaneswar’s first vinyl listening session — a
                relaxed, open space for music lovers, art lovers, and people who
                enjoy conversations that start with a song and end with a story.
                From Frank Sinatra to Hindi pop classics of the ’80s and ’90s,
                the music travels across eras, moods, and memories. Vinyl
                records spin live, blending seamlessly with an intimate house
                music set, great coffee, and a thoughtfully curated flea market
                featuring independent creators.
              </p>
              <p className="event-description" style={{ marginTop: "14px" }}>
                There’s no rush.
              </p>
              <p className="event-description">No rules.</p>
              <p className="event-description">No standing in one place.</p>
              <p className="event-description">
                Walk in, move around, talk music, discover new sounds, and let
                the records do their thing.
              </p>
              <p className="event-description">
                Whether you’re here for the vinyl, the house music, the art, the
                coffee, or just better conversations, Mocha Mono is a space to
                slow down, listen closely, and feel the moment.
              </p>
              <p className="event-description">
                Whether you’re here for the vinyl, the house music, the art, the
                coffee, or just better conversations, Mocha Mono is a space to
                slow down, listen closely, and feel the moment.
              </p>
              <p className="event-description" style={{ marginTop: "14px" }}>
                Volume 2 isn’t just an event — it’s another chapter in the story
                we’re writing together. Come be part of it.
              </p>
            </div>
          </section>

          <hr className="divider" />

          {/* Event Guide */}
          <section>
            <div className="guide-header">
              <h3 className="section-title" style={{ marginBottom: 0 }}>
                Event Guide
              </h3>
            </div>

            <div className="guide-grid">
              <div className="guide-item">
                <div className="guide-icon-bg">
                  <Languages size={20} />
                </div>
                <div className="guide-info">
                  <span className="guide-label">Language</span>
                  <span className="guide-value">English, Hindi</span>
                </div>
              </div>

              <div className="guide-item">
                <div className="guide-icon-bg">
                  <Clock size={20} />
                </div>
                <div className="guide-info">
                  <span className="guide-label">Duration</span>
                  <span className="guide-value">3 Hours and 30 Mins</span>
                </div>
              </div>

              <div className="guide-item">
                <div className="guide-icon-bg">
                  <Ticket size={20} />
                </div>
                <div className="guide-info">
                  <span className="guide-label">Tickets Needed For</span>
                  <span className="guide-value">All ages</span>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Bento Grid */}
          <section>
            <h3 className="section-title">Gallery</h3>
            <div className="bento-grid">
              <div className="bento-item bento-item-1">
                <img
                  src="https://media.insider.in/image/upload/w_800/v1770800440/vt0fg4iipvpaxqdiy3ip.jpg"
                  alt="Gallery Main"
                />
              </div>
              <div className="bento-item bento-item-2">
                <img
                  src="https://media.insider.in/image/upload/w_800/v1770800440/tjgegszhqridobbphtb5.jpg"
                  alt="Gallery 2"
                />
              </div>
              <div className="bento-item bento-item-3">
                <img
                  src="https://media.insider.in/image/upload/w_800/v1770800440/x3rlqvmzvfwsczfmcc0o.jpg"
                  alt="Gallery 3"
                />
              </div>
              <div className="bento-item bento-item-4">
                <img
                  src="https://media.insider.in/image/upload/w_800/v1770800447/yjmqd0ktbfsfehqjbqhc.jpg"
                  alt="Gallery 4"
                />
              </div>
              <div className="bento-item bento-item-5">
                <img
                  src="https://media.insider.in/image/upload/w_800/v1770800440/bqzdgbd1z3clmzextqdp.jpg"
                  alt="Gallery 5"
                />
              </div>
            </div>
          </section>

          <div className="venue-card-wrapper">
            <div className="venue-card">
              <div className="venue-info">
                <h3 className="section-title">Venue Details</h3>
                <p className="event-description">
                  <strong>
                    The B.O.M.B.A.I | Chandrasekharpur, Bhubaneshwar
                  </strong>
                  <br />
                  <span>Chandrasekharpur, Bhubaneshwar</span>
                </p>
              </div>
              <a
                href="https://www.google.com/maps?q=20.3165,85.8205"
                aria-label="Get Directions"
                className="directions-btn"
              >
                <MapPin size={14} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
