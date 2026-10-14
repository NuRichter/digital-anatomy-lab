import sys,json,collections,re
sys.stdout.reconfigure(encoding='utf-8')
els=json.load(open(sys.argv[1],encoding='utf8'))
def h(s,*k): return any(x in s for x in k)
RULES=[
 ('digestive',lambda n,a: h(n,'gallbladder','biliary','hepatic duct','bile duct','cystic duct')),
 ('nervous',lambda n,a: h(n,'choroid plexus','ciliary ganglion','ciliary nerve','nasociliary')),
 ('fascia',lambda n,a: h(n,'retinaculum','iliotibial tract','thyrohyoid membrane')),
 ('artery',lambda n,a: h(n,'celiac trunk','pulmonary trunk','costocervical trunk','thyrocervical trunk','brachiocephalic trunk','arteria ')),
 ('sensory',lambda n,a: h(n,'lacrimal','tarsal plate','eyelid')),
 ('heart',lambda n,a: n in ('wall of ventricle','parenchyma') ),
 ('integument',lambda n,a: h(n,'skin','hair of','eyebrow')),
 ('nervous',lambda n,a: h(n,'lateral ventricle','third ventricle','fourth ventricle','cerebral aqueduct','dura mater','central canal')),
 ('artery',lambda n,a: h(n,'artery','arteries','aorta','arterial','palmar arch','plantar arch','arcade')),
 ('vein',lambda n,a: h(n,'vein','venous','vena ','venae','sinus','tributary')),
 ('digestive',lambda n,a: h(n,'biliary','hepatic duct','bile duct','cystic duct','liver','sublingual','parotid','submandibular gland','gingiva')),
 ('respiratory',lambda n,a: h(n,'bronch','trachea','lung','pleura','larynx','laryn','vocal','conus elasticus','epiglott','thyroid cartilage','cricoid','arytenoid','corniculate','cuneiform cartilage','nasal cavity','nasal cartilage','alar cartilage')),
 ('heart',lambda n,a: h(n,'atrium','valve','cusp','leaflet','papillary','chordae','myocardium','heart','cavity of left ventricle','cavity of right ventricle','interventricular septum','auricle')),
 ('urinary',lambda n,a: h(n,'kidney','ureter','bladder','urethra','renal pelvis')),
 ('endocrine',lambda n,a: h(n,'adrenal','thyroid gland','pituitary','pineal','parathyroid')),
 ('lymphatic',lambda n,a: h(n,'spleen','thymus','lymph','tonsil')),
 ('reproductive',lambda n,a: h(n,'prostate','testis','penis','seminal','deferent','epididym','scrotum','glans')),
 ('sensory',lambda n,a: h(n,'eyeball','cornea','lens','retina','sclera','choroid','iris','vitreous','ciliar','external ear','cochlea','tympan')),
 ('ligament',lambda n,a: h(n,'ligament','interosseous membrane','raphe','tendinous arch','tendinous ring','trochlea of')),
 ('fascia',lambda n,a: h(n,'fascia','retinaculum','aponeurosis') and 'tensor' not in n),
 ('muscle',lambda n,a: h(a,'muscle organ','skeletal muscle','musculature','region of muscle') or re.search(r'\bmuscle|\bmusculus|tendon|deltoid|trapezius|pectoralis|latissimus|gluteus|rectus|oblique|biceps|triceps|quadriceps|sartorius|gracilis|soleus|gastrocnemius|tensor',n)),
 ('cartilage',lambda n,a: h(n,'cartilage','meniscus','intervertebral disc','articular disc')),
 ('nervous',lambda n,a: h(a,'nervous system','neuraxis','brain','spinal cord','nerve') or h(n,'nerve','plexus','ganglion','gyrus','colliculus','commissure','cerebr','cerebell','thalam','pons','medulla','midbrain','brain','spinal cord','decussation','peduncul','corpus callosum','fornix','hippocamp','amygdala','putamen','caudate nucleus','globus','insula','lobule','cuneus','uncus','olive')),
 ('skeletal',lambda n,a: h(a,'bone organ','skeletal system','bone of','set of bones') or h(n,'bone','vertebra','sacrum','coccyx','femur','tibia','fibula','humerus','radius','ulna','patella','scapula','clavicle','rib','sternum','mandible','maxilla','phalanx','tooth','incisor','molar','canine','skull','calcaneus','talus','hamate','capitate','scaphoid','lunate','trapez','pisiform','triquetr','cuboid','cuneiform','navicular','metacarp','metatars','hyoid','ilium','ischium','pubis','atlas','axis','xiphoid','manubrium')),
 ('respiratory',lambda n,a: h(a,'respiratory')),
 ('digestive',lambda n,a: h(a,'alimentary','gastrointestinal','pancreaticobiliary','mouth') or h(n,'stomach','colon','intestine','duodenum','jejunum','ileum','esophagus','pancreas','gallbladder','rectum','cecum','caecum','appendix','tongue','pharynx','anal canal','anus')),
 ('reproductive',lambda n,a: h(a,'genital')),
]
def system(o):
    n=o['name'].lower(); a=o['anc']
    for s,f in RULES:
        if f(n,a): return s
    return 'other'
c=collections.Counter(); ex=collections.defaultdict(list)
for o in els:
    s=system(o); o['system']=s; c[s]+=1; ex[s].append(o['name'])
for k,v in c.most_common(): print(f'\n## {k} {v}:', '; '.join(sorted(set(ex[k]))[:400 if k in sys.argv[2:] else 25]))
json.dump(els,open(sys.argv[1],'w',encoding='utf8'))
