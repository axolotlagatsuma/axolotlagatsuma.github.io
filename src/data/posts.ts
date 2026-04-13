export interface Post {
  id: string;
  title: string;
  date: string;
  securityLevel: "UNCLASSIFIED" | "CLASSIFIED" | "RESTRICTED";
  tags: string[];
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    id: "SYS-0001",
    title: "Signal Theory // On the Nature of Digital Noise",
    date: "13.04.2026 // 20:46",
    securityLevel: "UNCLASSIFIED",
    tags: ["SIGNAL_PROC", "THEORY", "SYSTEMS"],
    excerpt: "An examination of Shannon entropy as it applies to modern data transmission architectures. The noise floor is not an obstacle—it is the medium.",
    content: `## Abstract

The modern information landscape is defined not by signal clarity, but by our relationship with noise. Claude Shannon's foundational work on information theory established the mathematical framework for understanding channel capacity, but the philosophical implications remain underexplored.

## The Noise Floor Hypothesis

In any transmission system, there exists a baseline level of noise—the noise floor. Traditional engineering seeks to minimize this. We propose an alternative: **the noise floor is itself a carrier of information**.

### Key Observations

- Noise patterns in digital systems are rarely truly random
- Artifacts in compressed signals contain metadata about the compression algorithm
- The boundary between signal and noise is observer-dependent

## Implications for System Architecture

When designing archival systems, we must account for the information encoded in what we traditionally discard. Every filter is a form of censorship. Every compression is a form of editorialization.

> "The medium is the message" — Marshall McLuhan

This principle extends to digital architectures: the noise floor *is* the medium.

## Conclusion

Future archival systems should preserve noise alongside signal. The complete transmission—artifacts and all—represents a more truthful record than any filtered reconstruction.`
  },
  {
    id: "SYS-0002",
    title: "Architectural Persistence // Memory in Silicon",
    date: "10.04.2026 // 14:22",
    securityLevel: "CLASSIFIED",
    tags: ["ARCHITECTURE", "MEMORY", "HARDWARE"],
    excerpt: "On the physical substrate of digital memory and why silicon remembers what we tell it to forget.",
    content: `## The Persistence Problem

Data deletion is a myth. At the physical level, silicon retains electromagnetic ghosts of overwritten data. This document explores the implications for archival systems and data sovereignty.

## Magnetic Remanence

Even after overwrite operations, residual magnetic patterns persist on storage media. These patterns—while not directly readable through standard interfaces—represent a form of architectural memory.

## Implications

The archive does not forget. It merely obscures.`
  },
  {
    id: "SYS-0003",
    title: "Protocol Drift // When Standards Evolve",
    date: "05.04.2026 // 09:11",
    securityLevel: "RESTRICTED",
    tags: ["PROTOCOLS", "STANDARDS", "EVOLUTION"],
    excerpt: "An analysis of how communication protocols mutate over time, and what this means for long-term data preservation.",
    content: `## Protocol Archaeology

Communication protocols are living documents. They evolve, fork, and occasionally go extinct. This entry examines the lifecycle of digital protocols and their impact on archival permanence.

## Case Study: HTTP

From HTTP/0.9 to HTTP/3, each iteration has redefined how data moves across networks. Archived content encoded for one protocol version may become inaccessible as infrastructure evolves.

## The Preservation Paradox

To preserve digital content, we must also preserve the protocols that give it meaning. Content without context is noise.`
  }
];
