<template>
  <div class="legal-notices">
    <app-navbar></app-navbar>
    <div class="container">
      <div class="group">
        <h1>Mentions légales</h1>
        <h2>Propriétaire du site</h2>
        <div>Akim Setbon</div>
        <div>15 rue de Belfort, 93600 Aulnay-sous-Bois</div>
        <div><a href="mailto:akim.beat@gmail.com">akim.beat@gmail.com</a></div>
        <div><a href="tel:+33689315166">06 89 31 51 66</a></div>
      </div>

      <div class="group">
        <h2>Webmaster</h2>
        <div>Bryan Henryon</div>
        <div>
          <a href="mailto:b.henryon@outlook.fr">b.henryon@outlook.fr</a>
        </div>
      </div>

      <div class="group">
        <h2>Hébergement</h2>
        <div>&lt;Nom de l'hébergeur&gt;</div>
        <div>&lt;Adresse de l'hébergeur&gt;</div>
        <div>&lt;Coordonnées de l'hébergeur&gt;</div>
      </div>

      <div class="group">
        <h2>Propriété intellectuelle</h2>
        Akim Setbon est propriétaire exclusif de tous les droits de propriété
        intellectuelle ou détient les droits d’usage sur tous les éléments
        accessibles sur le site, tant sur la structure que sur les textes,
        images, graphismes, logo, icônes, sons, logiciels… Toute reproduction
        totale ou partielle du site &lt;nom du site&gt;, représentation,
        modification, publication, adaptation totale ou partielle de l'un
        quelconque de ces éléments, quel que soit le moyen ou le procédé
        utilisé, est interdite, sauf autorisation écrite préalable de Akim
        Setbon, propriétaire du site à l'email :
        <a href="mailto:akim.beats@gmail.com">akim.beats@gmail.com</a>, à défaut
        elle sera considérée comme constitutive d’une contrefaçon et passible de
        poursuite conformément aux dispositions des articles L.335-2 et suivants
        du Code de Propriété Intellectuelle.
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default {
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  }
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
.legal-notices {
  color: $color-white;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;
  padding: 3rem 6rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 2rem;
  }

  .group {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }

    h1 {
      margin-bottom: 3rem;

      @media (max-width: 480px) {
        font-size: 2.4rem;
      }
    }

    h2 {
      @media (max-width: 480px) {
        font-size: 2rem;
      }
    }

    * {
      margin-bottom: 0.5rem;
      @media (max-width: 480px) {
        font-size: 1.4rem;
      }
    }

    h1,
    h2 {
      font-weight: 500;
    }
  }
}

.container {
  max-width: 900px;
  margin: 10rem auto;

  @media (max-width: 768px) {
    margin: 5rem auto;
  }
}
</style>
