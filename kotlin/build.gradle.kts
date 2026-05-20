plugins {
    kotlin("jvm") version "1.9.0"
    id("maven-publish")
}

group = "mz.co.iradoweck"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
