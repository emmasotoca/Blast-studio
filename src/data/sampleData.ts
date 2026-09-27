export interface BlastSample {
  id: string;
  name: string;
  program: 'BLASTN' | 'BLASTP' | 'BLASTX';
  formatName: string;
  description: string;
  raw: string;
}

export const SAMPLE_BLASTN_16S: BlastSample = {
  id: 'blastn_16s',
  name: 'BlastN : ARNr 16S (E. coli)',
  program: 'BLASTN',
  formatName: 'Format Pairwise (outfmt 0)',
  description: 'Alignement nucléotidique de l\'ARN ribosomal 16S d\'Escherichia coli K-12 contre la base de référence bactérienne.',
  raw: `BLASTN 2.14.0+
Reference: Zheng Zhang, Scott Schwartz, Lukas Wagner, and Webb Miller (2000), "A greedy algorithm for aligning DNA sequences", J Comput Biol 2000; 7(1-2):203-14.

Database: RefSeq Bacterial 16S rRNA
           21,489 sequences; 31,452,109 total letters

Query= NR_024570.1 Escherichia coli strain U 5/41 16S ribosomal RNA, partial sequence
Length=1542

                                                                      Score     E
Sequences producing significant alignments:                          (Bits)  Value

NR_024570.1 Escherichia coli strain U 5/41 16S ribosomal RNA        2848    0.0  
NR_104858.1 Shigella flexneri strain ATCC 29903 16S ribosomal RNA   2832    0.0  
NR_074891.1 Salmonella enterica subsp. enterica 16S ribosomal RNA   2761    0.0  
NR_114789.1 Klebsiella pneumoniae strain DSM 30104 16S rRNA          2695    0.0  
NR_044372.1 Citrobacter koseri strain ATCC BAA-895 16S rRNA         2680    0.0  
NR_117686.1 Enterobacter cloacae strain ATCC 13047 16S rRNA         2664    0.0  
NR_042456.1 Yersinia pestis strain CO92 16S ribosomal RNA            2480    0.0  
NR_024647.1 Serratia marcescens strain ATCC 13880 16S rRNA          2452    0.0  
NR_043445.1 Proteus mirabilis strain ATCC 29906 16S rRNA            2312    0.0  
NR_113645.1 Pseudomonas aeruginosa strain DSM 50071 16S rRNA        1480    0.0  
NR_040843.1 Vibrio cholerae strain ATCC 14035 16S rRNA              1790    0.0  
NR_118428.1 Bacillus subtilis strain IAM 12118 16S rRNA              620    2e-174
NR_112073.1 Staphylococcus aureus strain ATCC 12600 16S rRNA         542    7e-151

>NR_024570.1 Escherichia coli strain U 5/41 16S ribosomal RNA, partial sequence
Length=1542

 Score = 2848 bits (1542),  Expect = 0.0
 Identities = 1542/1542 (100%), Gaps = 0/1542 (0%)
 Strand=Plus/Plus

Query  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60

Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120

Query  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180

Query  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240

Query  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300

Query  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360

Query  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420

Query  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480

Query  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540

Query  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600

>NR_104858.1 Shigella flexneri strain ATCC 29903 16S ribosomal RNA [Shigella flexneri]
Length=1542

 Score = 2832 bits (1533),  Expect = 0.0
 Identities = 1538/1542 (99%), Gaps = 2/1542 (0%)
 Strand=Plus/Plus

Query  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60

Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120

Query  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180

Query  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240

Query  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300

Query  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360

Query  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420

Query  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480

Query  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540

Query  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600

>NR_074891.1 Salmonella enterica subsp. enterica 16S ribosomal RNA [Salmonella enterica]
Length=1538

 Score = 2761 bits (1495),  Expect = 0.0
 Identities = 1520/1538 (98%), Gaps = 6/1538 (0%)
 Strand=Plus/Plus

Query  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60

Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120

Query  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180

Query  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240

Query  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300

Query  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360

Query  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420

Query  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480

Query  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540

Query  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600

>NR_114789.1 Klebsiella pneumoniae strain DSM 30104 16S rRNA [Klebsiella pneumoniae]
Length=1530

 Score = 2695 bits (1459),  Expect = 0.0
 Identities = 1500/1530 (98%), Gaps = 12/1530 (0%)
 Strand=Plus/Plus

Query  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60

Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120

Query  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180

Query  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240

Query  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300

Query  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360

Query  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420

Query  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480

Query  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540

Query  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600

>NR_042456.1 Yersinia pestis strain CO92 16S ribosomal RNA [Yersinia pestis]
Length=1534

 Score = 2480 bits (1342),  Expect = 0.0
 Identities = 1480/1534 (96%), Gaps = 18/1534 (1%)
 Strand=Plus/Plus

Query  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  1     AAATTGAAGAGTTTGATCATGGCTCAGATTGAACGCTGGCGGCAGGCCTAACACATGCAA  60

Query  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  61    GTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTGACGAGTGGCGGACGGGTGAGTAA  120

Query  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  121   TGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACTGGAAACGGTAGCTAATACCGCAT  180

Query  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  181   AACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTCTTGCCATCGGATGTGCCCAGATG  240

Query  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  241   GGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGCGACGATCCCTAGCTGGTCTGAGA  300

Query  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  301   GGATGACCAGCCACACTGGAACTGAGACACGGTCCAGACTCCTACGGGAGGCAGCAGTGG  360

Query  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  361   GGAATATTGCACAATGGGCGCAAGCCTGATGCAGCCATGCCGCGTGTATGAAGAAGGCCT  420

Query  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  421   TCGGGTTGTAAAGTACTTTCAGCGGGGAGGAAGGGAGTAAAGTTAATACCTTTGCTCATT  480

Query  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  481   GACGTTACCCGCAGAAGAAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAG  540

Query  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600
             ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Sbjct  541   GGTGCAAGCGTTAATCGGAATTACTGGGCGTAAAGCGCACGCAGGCGGTTTGTTAAGTCA  600

>NR_118428.1 Bacillus subtilis strain IAM 12118 16S rRNA [Bacillus subtilis]
Length=1550

 Score = 620 bits (335),  Expect = 2e-174
 Identities = 780/1020 (76%), Gaps = 68/1020 (7%)
 Strand=Plus/Plus

Query  40    GGCGGCAGGCCTAACACATGCAAGTCGAACGGTAACAGGAAGCAGCTTGCTGCTTCGCTG  99
             |||||| ||||||| ||||||||||||| ||| |||     |||     | | |      
Sbjct  35    GGCGGACGGCCTAATACATGCAAGTCGAGCGGAAAC-GATGGTA-----CGGTTTT-TGA  87

Query  100   ACGAGTGGCGGACGGGTGAGTAATGTCTGGGAAACTGCCTGATGGAGGGGGATAACTACT  159
               | ||||||||||||||||||| |  |||| | | ||||   ||| || |||||| |  
Sbjct  88    CTG-GTGGCGGACGGGTGAGTAACACGTGGGCAACCTGCCTCTCGA-TGTGGTAAC-AAC  144

Query  160   GGAAACGGTAGCTAATACCGCATAACGTCGCAAGACCAAAGAGGGGGACCTTCGGGCCTC  219
             ||| ||   ||||||||||| |||     | |     || |   ||||   ||   |   
Sbjct  145   GGACACCCGAGCTAATACCGGATACACCGGGATTTGAAACG---GGGAGGCTC--TCGGT  199

Query  220   TTGCCATCGGATGTGCCCAGATGGGATTAGCTAGTAGGTGGGGTAACGGCTCACCTAGGC  279
             ||   |  ||||| ||||     |||||||||||| |||||||||  ||||||||||  |
Sbjct  200   TTTGGACTGGATGGGCCCGCGTAGGATTAGCTAGTTGGTGGGGTAATGGCTCACCAAGTC  259
`
};

export const SAMPLE_BLASTP_KINASE: BlastSample = {
  id: 'blastp_kinase',
  name: 'BlastP : Domaine Kinase EGFR (Humain)',
  program: 'BLASTP',
  formatName: 'Format XML (BlastOutput)',
  description: 'Alignement protéique du domaine tyrosine-kinase du récepteur du facteur de croissance épidermique humain (EGFR) contre Swiss-Prot.',
  raw: `<?xml version="1.0"?>
<!DOCTYPE BlastOutput PUBLIC "-//NCBI//NCBI BlastOutput/EN" "https://blast.ncbi.nlm.nih.gov/dtd/NCBI_BlastOutput.dtd">
<BlastOutput>
  <BlastOutput_program>blastp</BlastOutput_program>
  <BlastOutput_version>BLASTP 2.14.0+</BlastOutput_version>
  <BlastOutput_reference>Stephen F. Altschul, Thomas L. Madden, Alejandro A. Schaffer, Jinghui Zhang, Zheng Zhang, Webb Miller, and David J. Lipman (1997), Gapped BLAST and PSI-BLAST: a new generation of protein database search programs, Nucleic Acids Res. 25:3389-3402.</BlastOutput_reference>
  <BlastOutput_db>swissprot</BlastOutput_db>
  <BlastOutput_query-ID>Query_4201</BlastOutput_query-ID>
  <BlastOutput_query-def>sp|P00533|EGFR_HUMAN Epidermal growth factor receptor kinase domain [Homo sapiens]</BlastOutput_query-def>
  <BlastOutput_query-len>320</BlastOutput_query-len>
  <BlastOutput_param>
    <Parameters>
      <Parameters_matrix>BLOSUM62</Parameters_matrix>
      <Parameters_expect>10</Parameters_expect>
      <Parameters_gap-open>11</Parameters_gap-open>
      <Parameters_gap-extend>1</Parameters_gap-extend>
    </Parameters>
  </BlastOutput_param>
  <BlastOutput_iterations>
    <Iteration>
      <Iteration_iter-num>1</Iteration_iter-num>
      <Iteration_query-ID>Query_4201</Iteration_query-ID>
      <Iteration_query-def>sp|P00533|EGFR_HUMAN Epidermal growth factor receptor kinase domain [Homo sapiens]</Iteration_query-def>
      <Iteration_query-len>320</Iteration_query-len>
      <Iteration_hits>
        <Hit>
          <Hit_num>1</Hit_num>
          <Hit_id>sp|P00533.2|EGFR_HUMAN</Hit_id>
          <Hit_def>Epidermal growth factor receptor OS=Homo sapiens OX=9606 GN=EGFR PE=1 SV=2 [Homo sapiens]</Hit_def>
          <Hit_accession>P00533</Hit_accession>
          <Hit_len>1210</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>652.514</Hsp_bit-score>
              <Hsp_score>1682</Hsp_score>
              <Hsp_evalue>0.0</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>320</Hsp_query-to>
              <Hsp_hit-from>695</Hsp_hit-from>
              <Hsp_hit-to>1014</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>320</Hsp_identity>
              <Hsp_positive>320</Hsp_positive>
              <Hsp_gaps>0</Hsp_gaps>
              <Hsp_align-len>320</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_qseq>
              <Hsp_hseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_hseq>
              <Hsp_midline>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>2</Hit_num>
          <Hit_id>sp|Q01279.1|EGFR_MOUSE</Hit_id>
          <Hit_def>Epidermal growth factor receptor OS=Mus musculus OX=10090 GN=Egfr PE=1 SV=1 [Mus musculus]</Hit_def>
          <Hit_accession>Q01279</Hit_accession>
          <Hit_len>1210</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>638.261</Hsp_bit-score>
              <Hsp_score>1645</Hsp_score>
              <Hsp_evalue>0.0</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>320</Hsp_query-to>
              <Hsp_hit-from>695</Hsp_hit-from>
              <Hsp_hit-to>1014</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>311</Hsp_identity>
              <Hsp_positive>317</Hsp_positive>
              <Hsp_gaps>0</Hsp_gaps>
              <Hsp_align-len>320</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_qseq>
              <Hsp_hseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSVLEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_hseq>
              <Hsp_midline>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISS+LEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQ</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>3</Hit_num>
          <Hit_id>sp|P04626.1|ERBB2_HUMAN</Hit_id>
          <Hit_def>Receptor tyrosine-protein kinase erbB-2 OS=Homo sapiens OX=9606 GN=ERBB2 PE=1 SV=1 [Homo sapiens]</Hit_def>
          <Hit_accession>P04626</Hit_accession>
          <Hit_len>1255</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>524.242</Hsp_bit-score>
              <Hsp_score>1349</Hsp_score>
              <Hsp_evalue>2.4e-182</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>318</Hsp_query-to>
              <Hsp_hit-from>727</Hsp_hit-from>
              <Hsp_hit-to>1044</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>254</Hsp_identity>
              <Hsp_positive>282</Hsp_positive>
              <Hsp_gaps>0</Hsp_gaps>
              <Hsp_align-len>318</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIP</Hsp_qseq>
              <Hsp_hseq>VAIKVLRENTSPKANKEILDEAYVMAGVGSPYVSRLLGICLTSTVQLVTQLMPYGCLLDHVRENRGRLGSQDLLNWCMQIAKGMSYLEDVRLVHRDLAARNVLVKSPNHVKITDFGLARLLDIDETEYHADGGKVPIKWMALESILRRRFTHQSDVWSYGVTVWELMTFGAKPYDGIPAREIPDLLEKGERLPQPPICTIDVYMIMVKCWMIDSECRPRFRELVSEFSRMARDPQRFVVIQNEDLGPASPLDSTFYRSLLEDDDMGDLVDAEEYLVP</Hsp_hseq>
              <Hsp_midline>VAIK LRE TSPKANKEILDEAYVMA V +P+V RLLGICLTSTVQL+TQLMP+GCLLD+VRE++  +GSQ LLNWC+QIAKGM+YLED RLVHRDLAARNVLVK+P HVKITDFGLA+LL  +E EYHA+GGKVPIKWMALESIL R +THQSDVWSYGVTVWELMTFG+KPYDGIPA EI  +LEKGERLPQPPICTIDVYMIMVKCWMID++ RP+FREL+ EFS+MARDPQR++VIQ ++    SP D+ FYR+L++++DM D+VDA+EYL+P</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>4</Hit_num>
          <Hit_id>sp|Q15303.1|ERBB4_HUMAN</Hit_id>
          <Hit_def>Receptor tyrosine-protein kinase erbB-4 OS=Homo sapiens OX=9606 GN=ERBB4 PE=1 SV=1 [Homo sapiens]</Hit_def>
          <Hit_accession>Q15303</Hit_accession>
          <Hit_len>1308</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>492.271</Hsp_bit-score>
              <Hsp_score>1266</Hsp_score>
              <Hsp_evalue>6.8e-170</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>318</Hsp_query-to>
              <Hsp_hit-from>724</Hsp_hit-from>
              <Hsp_hit-to>1041</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>238</Hsp_identity>
              <Hsp_positive>278</Hsp_positive>
              <Hsp_gaps>0</Hsp_gaps>
              <Hsp_align-len>318</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIP</Hsp_qseq>
              <Hsp_hseq>VAIKVLREDTSPKANKEILDEAYVMAGVGSPYVSRLLGICLTSTVQLVTQLMPYGCLLDHVREHKGRLGSQDLLNWCMQIAKGMSYLEDVRLVHRDLAARNVLVKSPSHVKITDFGLARLLEAEEKEYHADGGKVPIKWMALESILRRRFTHQSDVWSYGVTVWELMTFGAKPYDGIPAREIPDLLEKGERLPQPPICTIDVYMIMVKCWMIDSECRPRFRELVSEFSRMARDPQRFVVIQNEDLGPASPLDSTFYRSLLEDDDMGDLVDAEEYLVP</Hsp_hseq>
              <Hsp_midline>VAIK LRE TSPKANKEILDEAYVMA V +P+V RLLGICLTSTVQL+TQLMP+GCLLD+VREHK  +GSQ LLNWC+QIAKGM+YLED RLVHRDLAARNVLVK+P HVKITDFGLA+LL AEEKEYHA+GGKVPIKWMALESIL R +THQSDVWSYGVTVWELMTFG+KPYDGIPA EI  +LEKGERLPQPPICTIDVYMIMVKCWMID++ RP+FREL+ EFS+MARDPQR++VIQ ++    SP D+ FYR+L++++DM D+VDA+EYL+P</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>5</Hit_num>
          <Hit_id>sp|P07949.2|RET_HUMAN</Hit_id>
          <Hit_def>Proto-oncogene tyrosine-protein kinase receptor Ret OS=Homo sapiens OX=9606 GN=RET PE=1 SV=2 [Homo sapiens]</Hit_def>
          <Hit_accession>P07949</Hit_accession>
          <Hit_len>1114</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>312.383</Hsp_bit-score>
              <Hsp_score>800</Hsp_score>
              <Hsp_evalue>1.2e-99</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>274</Hsp_query-to>
              <Hsp_hit-from>734</Hsp_hit-from>
              <Hsp_hit-to>1006</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>148</Hsp_identity>
              <Hsp_positive>198</Hsp_positive>
              <Hsp_gaps>3</Hsp_gaps>
              <Hsp_align-len>274</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPT</Hsp_qseq>
              <Hsp_hseq>VAIKVLRENASPEKVKDFLSEASVMKGFTHRNVVRLLGVCTKS-PQYIIELMEYGALKDFLRESR--IGSQNLLNWCMQVAKGMEYLSERKLVHRDLASRNVLVKDPNHVKITDFGLSRDVYEDSYYKKTEGGKLPVKWMAIESLFDHIYTTQSDVWSFGVLLWEIVTLGGNPYPGIPPERLFNLLKTGHRMERPDNCSEEMYRLMLQCWKQEPDKRPSFATISEELTKLSREPEGYKDLECEE-SHLPEPE</Hsp_hseq>
              <Hsp_midline>VAIK LRE  SP+  K+ L EA VM    + +V RLLG+C  S  Q I +LM +G L D++RE +  IGSQ LLNWC+Q+AKGM YL +R+LVHRDLA+RNVLVK P HVKITDFGL++ +  +     +EGGK+P+KWMA+ES++  IYT QSDVWS+GV +WE++T G  PY GIP   + ++L+ G R+ +P  C+ ++Y +M++CW  + D RP F  +  E +K++R+P+ Y  ++  E  HLP P </Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>6</Hit_num>
          <Hit_id>sp|P11362.2|FGFR1_HUMAN</Hit_id>
          <Hit_def>Fibroblast growth factor receptor 1 OS=Homo sapiens OX=9606 GN=FGFR1 PE=1 SV=2 [Homo sapiens]</Hit_def>
          <Hit_accession>P11362</Hit_accession>
          <Hit_len>822</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>285.419</Hsp_bit-score>
              <Hsp_score>730</Hsp_score>
              <Hsp_evalue>4.5e-89</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>275</Hsp_query-to>
              <Hsp_hit-from>488</Hsp_hit-from>
              <Hsp_hit-to>760</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>135</Hsp_identity>
              <Hsp_positive>192</Hsp_positive>
              <Hsp_gaps>4</Hsp_gaps>
              <Hsp_align-len>276</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVRE-HKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTD</Hsp_qseq>
              <Hsp_hseq>VAIKMLKDDSSDKDLSDLVSEMEMMKMIGKHKNIINLLGACTQDGPLYVIVEYASKGNLREYLQARRPPGLYSYTFNEKRELSFQYLMEI-LVHRDLAARNVLVNEDLVAKITDFGLARGIE-DNEYTARQGAKFPIKWTAPEALFHGRFTIKSDVWSFGILLWEIFTLGGSPYPGVPVEELFKLLKEGHRMDKPSNCTNELYMMMRDCWHAVPSQRPTFKQLVEDLDRIVALTSNQEYLDLS-MP</Hsp_hseq>
              <Hsp_midline>VAIK L++ +S K   +++ EA +M  +  +    +L     +   L  ++       +   + +   +      N       GM YL +  LVHRDLAARNVLV+     KITDFGLA+ +  ++ Y A +G K PIKW A E++ H  +T +SDVWS+G+ +WE+ T G  PY G+P  E+  +L++G R+ +P  CT ++YM+M  CW     +RP F++L+ +  ++     +  + L    D</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
        <Hit>
          <Hit_num>7</Hit_num>
          <Hit_id>sp|P06213.2|INSR_HUMAN</Hit_id>
          <Hit_def>Insulin receptor OS=Homo sapiens OX=9606 GN=INSR PE=1 SV=2 [Homo sapiens]</Hit_def>
          <Hit_accession>P06213</Hit_accession>
          <Hit_len>1382</Hit_len>
          <Hit_hsps>
            <Hsp>
              <Hsp_num>1</Hsp_num>
              <Hsp_bit-score>248.825</Hsp_bit-score>
              <Hsp_score>634</Hsp_score>
              <Hsp_evalue>3.1e-75</Hsp_evalue>
              <Hsp_query-from>1</Hsp_query-from>
              <Hsp_query-to>270</Hsp_query-to>
              <Hsp_hit-from>1012</Hsp_hit-from>
              <Hsp_hit-to>1276</Hsp_hit-to>
              <Hsp_query-frame>0</Hsp_query-frame>
              <Hsp_hit-frame>0</Hsp_hit-frame>
              <Hsp_identity>120</Hsp_identity>
              <Hsp_positive>175</Hsp_positive>
              <Hsp_gaps>7</Hsp_gaps>
              <Hsp_align-len>271</Hsp_align-len>
              <Hsp_qseq>VAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLP</Hsp_qseq>
              <Hsp_hseq>VAVKTVNESASLRERIEFLNEASVMKGFTCHHVVRLLGVVSKGQPTLVVMELMAHGDLKSYLRSLRPEAENNPG--RPEPRK-M-YLEMAKLVHRDLAARNCMVAHDFTVKIGDFGMTRDIYETDYYRKGGKGLLPVRWMAPESLKDGVFTTSSDMWSFGVVLWEITSLAEQPYQGLSNEQVLKFVMDGGYLDQPDNCPERVTDLMRMCWQFNPKMRPTFLEIVNLLKDDLHPSFPEVSFFHSEENKAP</Hsp_hseq>
              <Hsp_midline>VA+K + E+ S +   E L+EA VM      HV RLLG+       L+   +   G L   R                  A  M YLE  +LVHRDLAARN +V    +VKI DFG+ + +   +       G +P++WMA ES+   ++T  SD+WS+GV +WE+ +   +PY G+   ++   +  G  L QP  C   V  +M  CW  +   RP F E++    +     P       E + P</Hsp_midline>
            </Hsp>
          </Hit_hsps>
        </Hit>
      </Iteration_hits>
    </Iteration>
  </BlastOutput_iterations>
</BlastOutput>`
};

export const SAMPLE_BLASTX_METAGENOMICS: BlastSample = {
  id: 'blastx_metagenomics',
  name: 'BlastX : Métagénomique environnementale',
  program: 'BLASTX',
  formatName: 'Format Tabulaire outfmt 7 avec Métadonnées',
  description: 'Contig métagénomique marin (ADN) traduit dans les 6 cadres de lecture et comparé à une base de données de protéines virales et bactériennes.',
  raw: `# BLASTX 2.14.0+
# Query: ENV_CONTIG_2841 Marine sediment environmental contig 2841
# Database: nr_viral_microbial_prot
# Fields: qseqid, sseqid, pident, length, mismatch, gapopen, qstart, qend, sstart, send, evalue, bitscore, stitle, qcovs, qlen
# 12 hits found
ENV_CONTIG_2841	YP_009142109.1	89.4	425	45	0	45	1320	1	425	0.0	782.4	major capsid protein [Pelagibacter phage HTVC010P]	85	1500
ENV_CONTIG_2841	YP_009142110.1	76.2	380	90	1	50	1190	12	391	1.2e-164	570.8	structural capsid decoration protein [Pelagibacter phage HTVC011P]	76	1500
ENV_CONTIG_2841	YP_009142111.1	68.5	410	129	0	60	1290	5	414	3.4e-142	502.1	capsid assembly protein [Prochlorococcus phage P-SSM2]	82	1500
ENV_CONTIG_2841	WP_011012398.1	52.3	290	138	2	200	1070	15	304	4.5e-85	315.6	DNA packaging terminase large subunit [Candidatus Pelagibacter ubique]	58	1500
ENV_CONTIG_2841	WP_041289104.1	49.8	285	143	1	215	1070	10	294	9.1e-78	290.2	terminase ATPase subunit [Pelagibacterales bacterium]	57	1500
ENV_CONTIG_2841	YP_004561234.1	44.1	260	145	3	300	1080	22	281	6.2e-56	220.5	portal protein [Synechococcus phage S-SM1]	52	1500
ENV_CONTIG_2841	YP_002341901.1	41.2	245	144	2	350	1085	1	245	2.8e-47	191.0	phage tail tape measure protein [Cyanophage P-TIM68]	49	1500
ENV_CONTIG_2841	WP_098765432.1	38.5	210	129	1	400	1030	14	223	4.1e-35	152.4	tail tubular protein A [SAR11 cluster bacterium]	42	1500
ENV_CONTIG_2841	WP_012345678.1	35.2	190	123	2	450	1020	5	194	7.9e-26	122.8	bacteriophage structural protein [Vibrio phage VP882]	38	1500
ENV_CONTIG_2841	YP_009988776.1	32.6	184	124	1	480	1032	2	185	1.5e-18	98.2	tail fibers protein [Caulobacter phage CcrColossus]	37	1500
ENV_CONTIG_2841	WP_033221100.1	29.8	150	105	3	600	1050	10	159	3.2e-09	68.4	hypothetical protein [Marine Group II euryarchaeote]	30	1500
ENV_CONTIG_2841	WP_044556677.1	28.1	120	86	2	700	1060	1	120	4.5e-04	51.2	membrane protein [Roseobacter denitrificans]	24	1500`
};

export const SAMPLES: BlastSample[] = [
  SAMPLE_BLASTN_16S,
  SAMPLE_BLASTP_KINASE,
  SAMPLE_BLASTX_METAGENOMICS
];
