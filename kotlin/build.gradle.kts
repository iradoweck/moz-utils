plugins {
    kotlin("jvm") version "2.3.21"
    id("maven-publish")
}

group = "com.edmilsonmuacigarro"
version = "0.3.9"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["java"])
            pom {
                name.set("moz-utils")
                description.set("Funções de utilidade para Moçambique. Validação de NUIT, documentos e formatação de telefones.")
                url.set("https://iradoweck.github.io/moz-utils/")
                licenses {
                    license {
                        name.set("The Apache License, Version 2.0")
                        url.set("http://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
                developers {
                    developer {
                        id.set("iradoweck")
                        name.set("Edmilson Muacigarro")
                        email.set("contacto@edmilsonmuacigarro.com")
                        organizationUrl.set("https://edmilsonmuacigarro.com")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/iradoweck/moz-utils.git")
                    developerConnection.set("scm:git:ssh://github.com/iradoweck/moz-utils.git")
                    url.set("https://github.com/iradoweck/moz-utils/")
                }
            }
        }
    }
}
